(function ($, require) {
  if (!window.piwik || !piwik.openTelemetryEnabled) {
      return;
  }

  if (!piwik.openTelemetryEndpoint) {
      return;
  }

  window.MatomoOpenTelemetry = {
    enabled: true,
    traceUrl: piwik.openTelemetryEndpoint,
    serviceName: piwik.openTelemetryServiceName,
    enableDocumentLoadMonitoring: Boolean(piwik.openTelemetryDocumentLoadMonitoring),
    enableUserInteractionMonitoring: Boolean(piwik.openTelemetryUserInteractionMonitoring),
    enableXMLHttpRequestMonitoring: Boolean(piwik.openTelemetryXMLHttpRequestMonitoring),
    enableWebVitals: Boolean(piwik.openTelemetryWebVitals),
    enableUxMonitoring: Boolean(piwik.openTelemetryUxMonitoring),
    resourceAttributes: piwik.openTelemetryResourceAttributes,
  };

})(jQuery, require);