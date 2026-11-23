# Changelog

## Unreleased

### Security

- The values of secret parameters, such as `token_auth` and passwords, are no longer sent. The
  span of a request held its full address, and log entries their full context.
- The browser adds the trace headers only to requests to Matomo itself. It added them to every
  request, also to other websites, which told them the trace and could make such a request fail.
- The settings for the endpoint and the Content Security Policy are checked. The CSP value went
  into the header as it was written.

### Fixed

- A request to Matomo gets a span. The plugin listened to the event of the requests Matomo
  makes to other servers and described those as requests to Matomo.
- Spans are ended and detached in the order they were opened, also when an API method throws or
  a request ends early. Spans were left active, which PHP reported as
  "missing call to Scope::detach()".
- API methods that run inside one another each get their span.
- Matomo no longer fails when the plugin is active without the OpenTelemetry packages for PHP.
  Only the browser is measured then.

### Added

- A span for each request Matomo makes to another server.
- The Swedish translation is complete.
- Tests for the spans, the log entries and the settings, and a workflow for static analysis.

### Changed

- A span of a request is named after its module and action, as `GET CoreHome.index`, and not
  after its address. The address is in the attribute `http.url`.
- The span of an API method is named after the plugin and method, as `API VisitsSummary.get`.
- Needs PHP 8.0.

## [0.1.3] - 2026-02-18

### Changed

- JS libraries updated.

## [0.1.2] - 2026-02-16

### Added

- Just some minor code style fixes.

## [0.1.1] - 2026-02-15

### Added

- [PHP] Metrics for memory usage, core archiving, api requests
- [PHP] Log exporter

## [0.1.0] - 2026-02-07

### Added

- System settings for UI monitoring.
- [JS] Traces for LoadMonitoring, UserInteraction, XMLHttpRequests.
- [JS] Traces for basic UX monitoring.
- [JS] Error traces.
- [JS] Error notification traces from UI.
- [JS] Web Vital traces

## [0.0.1] - 2026-01-13

### Added

- [PHP] Traces for API and requests.
