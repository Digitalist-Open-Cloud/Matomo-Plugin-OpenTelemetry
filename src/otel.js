import { trace, SpanStatusCode, context } from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { onCLS, onLCP, onINP } from 'web-vitals';

/* ------------------------------------------------------------------
 * Configuration (injected by Matomo at runtime)
 * ------------------------------------------------------------------ */
const CONFIG = window.MatomoOpenTelemetry || {};

const OTEL_TRACE_URL =
  CONFIG.traceUrl ?? 'http://127.0.0.1:4318/v1/traces';

const SERVICE_NAME =
  CONFIG.serviceName ?? 'matomo-frontend';

/* ------------------------------------------------------------------
 * OpenTelemetry setup
 * ------------------------------------------------------------------ */
const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    'service.name': SERVICE_NAME,
  }),
  spanProcessors: [
    new BatchSpanProcessor(
      new OTLPTraceExporter({ url: OTEL_TRACE_URL })
    ),
  ],
});

provider.register();

const tracer = trace.getTracer(SERVICE_NAME);

/* ------------------------------------------------------------------
 * UI page span handling (SPA-aware)
 * ------------------------------------------------------------------ */
let currentPageSpan = null;
let currentPageContext = context.active();

function startPageSpan() {
  // End previous page span
  if (currentPageSpan) {
    currentPageSpan.end();
  }

  currentPageSpan = tracer.startSpan('ui.page', {
    attributes: {
      'browser.page.url': window.location.href,
      'browser.page.path': window.location.pathname,
      'browser.page.hash': window.location.hash,
      'browser.page.title': document.title,
      // Matomo-specific context (best-effort)
      'matomo.module': window.piwik?.module,
      'matomo.action': window.piwik?.action,
    },
  });

  currentPageContext = trace.setSpan(
    context.active(),
    currentPageSpan
  );
}

// Initial page
startPageSpan();

// Matomo SPA navigation (hash-based)
window.addEventListener('hashchange', () => {
  startPageSpan();
});

// Safety: end page span when leaving the document
window.addEventListener('beforeunload', () => {
  if (currentPageSpan) {
    currentPageSpan.end();
  }
});

/* ------------------------------------------------------------------
 * Error tracking
 * ------------------------------------------------------------------ */
function recordErrorSpan(name, error) {
  try {
    const span = tracer.startSpan(name, {}, currentPageContext);

    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.setAttribute('error.message', error.message);
    span.setAttribute('error.name', error.name);
    span.setAttribute('error.stack', error.stack ?? '');
    span.setAttribute('browser.page.url', window.location.href);
    span.setAttribute('browser.page.path', window.location.pathname);
    span.setAttribute('matomo.module', window.piwik?.module);
    span.setAttribute('matomo.action', window.piwik?.action);

    span.end();
    provider.forceFlush();
  } catch (e) {
    console.warn('[OTel] failed to record error span', e);
  }
}

window.addEventListener('error', (event) => {
  recordErrorSpan(
    'js.error',
    event.error || new Error(event.message)
  );
});

window.addEventListener('unhandledrejection', (event) => {
  recordErrorSpan(
    'js.unhandled_promise',
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason))
  );
});


/* ------------------------------------------------------------------
 * UI notification monitoring
 * ------------------------------------------------------------------ */
function observeMatomoNotifications() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        // Match Matomo error notifications
        if (node.classList?.contains('notification-error')) {
          const message =
            node.querySelector('.notification-body div')?.innerText?.trim();

          if (!message) {
            continue;
          }

          const span = tracer.startSpan(
            'ui.notification.error',
            {
              attributes: {
                'ui.notification.type': 'error',
                'ui.notification.message': message,
                'browser.page.url': window.location.href,
                'browser.page.path': window.location.pathname,
                'matomo.module': window.piwik?.module,
                'matomo.action': window.piwik?.action,
              },
            },
            currentPageContext
          );

          span.setStatus({ code: SpanStatusCode.ERROR });
          span.end();
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Start observing once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeMatomoNotifications);
} else {
  observeMatomoNotifications();
}

/* ------------------------------------------------------------------
 * Web Vitals (browser.web_vital – spec compliant)
 * ------------------------------------------------------------------ */
function emitWebVital(metric) {
  const span = tracer.startSpan(
    'browser.web_vital',
    {
      attributes: {
        // Page / UI context for Grafana & Tempo
        'browser.page.url': window.location.href,
        'browser.page.path': window.location.pathname,
        'matomo.module': window.piwik?.module,
        'matomo.action': window.piwik?.action,
      },
    },
    currentPageContext
  );

  // Required Web Vital event fields (per spec)
  span.addEvent('browser.web_vital', {
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

/* ------------------------------------------------------------------
 * UX monitoring: long tasks (>50ms)
 * ------------------------------------------------------------------ */
if (
  'PerformanceObserver' in window &&
  PerformanceObserver.supportedEntryTypes?.includes('longtask')
) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const span = tracer.startSpan(
        'ux.long_task',
        {
          attributes: {
            'browser.page.path': window.location.pathname,
          },
        },
        currentPageContext
      );

      span.addEvent('ux.long_task', {
        duration: entry.duration,
        startTime: entry.startTime,
      });

      span.end();
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}