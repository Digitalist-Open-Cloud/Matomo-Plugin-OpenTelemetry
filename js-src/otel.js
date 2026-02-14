import { trace, SpanStatusCode, context, propagation } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from '@opentelemetry/context-zone';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes, detectResources } from "@opentelemetry/resources";
import { browserDetector } from '@opentelemetry/opentelemetry-browser-detector';
import { onCLS, onLCP, onINP } from "web-vitals";

(function initOpenTelemetry() {
  // Configuration from start.js (Matomo variables)
  const CONFIG = window.MatomoOpenTelemetry || {};

  if (!CONFIG.enabled) {
    return;
  }

  const OTEL_TRACE_URL = CONFIG.traceUrl ?? "";

  const SERVICE_NAME = CONFIG.serviceName ?? "matomo-frontend";
  const detectedResources = detectResources({
    detectors: [browserDetector],
  });

  let resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
  });
  resource = resource.merge(detectedResources);

  // OpenTelemetry setup
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: OTEL_TRACE_URL })
      ),
    ],
  });

  provider.register({
    contextManager: new ZoneContextManager(),
    propagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
      ],
    }),
  });
  const siteId = window.piwik?.idSite;
  if (siteId !== undefined && siteId !== null) {
    const baggage = propagation.createBaggage({
      'matomo.site_id': { value: String(siteId) },
    });

    const baggageContext = propagation.setBaggage(
      context.active(),
      baggage
    );
    context.with(baggageContext, () => {

    });
  }

  const instrumentations = [];

  if (CONFIG.enableDocumentLoadMonitoring) {
    instrumentations.push(
      new DocumentLoadInstrumentation()
    );
  }

  if (CONFIG.enableUserInteractionMonitoring) {
    instrumentations.push(
      new UserInteractionInstrumentation()
    );
  }

  if (CONFIG.enableXMLHttpRequestMonitoring) {
    instrumentations.push(
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [/.*/],
      })
    );
  }

  if (instrumentations.length > 0) {
    registerInstrumentations({
      instrumentations,
    });
  }

  const tracer = trace.getTracer(SERVICE_NAME);
  let currentPageSpan = null;
  let currentPageContext = context.active();

  if (CONFIG.enableUxMonitoring) {
    function startPageSpan() {
      // End previous page span
      if (currentPageSpan) {
        currentPageSpan.end();
      }

      currentPageSpan = tracer.startSpan("ui.page", {
        attributes: {
          "http.url": window.location.href,
          "http.path": window.location.pathname,
          "http.title": document.title,
        },
      });

      currentPageContext = trace.setSpan(context.active(), currentPageSpan);
    }

    startPageSpan();

    // Listen on page changes
    window.addEventListener("hashchange", () => {
      startPageSpan();
    });

    // End page span when leaving the document
    window.addEventListener("beforeunload", () => {
      if (currentPageSpan) {
        currentPageSpan.end();
      }
    });
  }

  // Error tracking
  function recordErrorSpan(name, error) {
    try {
      const span = tracer.startSpan(name, {}, currentPageContext);

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.setAttribute("error.message", error.message);
      span.setAttribute("error.name", error.name);
      span.setAttribute("error.stack", error.stack ?? "");
      span.setAttribute("http.url", window.location.href);
      span.setAttribute("http.path", window.location.pathname);
      span.setAttribute("http.title", document.title);

      span.end();
      provider.forceFlush();
    } catch (e) {
      console.warn("OpenTelemetry: failed to record error span", e);
    }
  }

  window.addEventListener("error", (event) => {
    recordErrorSpan("js.error", event.error || new Error(event.message));
  });

  window.addEventListener("unhandledrejection", (event) => {
    recordErrorSpan(
      "js.unhandled_promise",
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
    );
  });

  // UI error notification monitoring.
  // Catches errors displayed for users in Matomo.
  function observeAjaxErrors() {
    const container = document.getElementById("ajaxError");
    if (!container) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }

          const errorNode = node.matches?.(".notification-error")
            ? node
            : node.querySelector?.(".notification-error");

          if (!errorNode) {
            continue;
          }

          const message = errorNode
            .querySelector(".notification-body div")
            ?.innerText?.trim();

          if (!message) {
            continue;
          }

          const span = tracer.startSpan(
            "ui.notification.error",
            {
              attributes: {
                "ui.notification.type": "error",
                "ui.notification.message": message,
                "http.url": window.location.href,
                "http.path": window.location.pathname,
              },
            },
            currentPageContext
          );

          span.setStatus({ code: SpanStatusCode.ERROR });
          span.end();
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeAjaxErrors);
  } else {
    observeAjaxErrors();
  }

  if (CONFIG.enableWebVitals) {
    function emitWebVital(metric) {
      const span = tracer.startSpan(
        "browser.web_vital",
        {
          attributes: {
            "http.url": window.location.href,
            "http.path": window.location.pathname,
          },
        },
        currentPageContext
      );

      span.addEvent("browser.web_vital", {
        name: metric.name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
      });

      span.end();
    }

    onCLS(emitWebVital);
    onLCP(emitWebVital);
    onINP(emitWebVital);
  }

  // Web vitals long task monitoring, check if it is supported by the browser.
  if (
    CONFIG.enableUxMonitoring &&
    "PerformanceObserver" in window &&
    PerformanceObserver.supportedEntryTypes?.includes("longtask")
  ) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const span = tracer.startSpan(
          "ux.long_task",
          {
            attributes: {
              "http.url": window.location.href,
              "http.path": window.location.pathname,
            },
          },
          currentPageContext
        );

        span.addEvent("ux.long_task", {
          duration: entry.duration,
          startTime: entry.startTime,
        });

        span.end();
      }
    });

    observer.observe({ entryTypes: ["longtask"] });
  }
})();
