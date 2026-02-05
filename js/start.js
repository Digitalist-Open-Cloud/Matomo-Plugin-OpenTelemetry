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
    enableWebVitals: Boolean(piwik.openTelemetryWebVitals),
    enableUxMonitoring: Boolean(piwik.openTelemetryUxMonitoring),
  };

})(jQuery, require);