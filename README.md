# OpenTelemetry for Matomo

OpenTelemetry plugin for Matomo.

Traces API and Requests from Matomo. More could be added later on.

Please note that this plugin require additional composer packages, which are not included,
and needs to be installed together with the plugin. Also it needs the PHP extension OpenTelemetry.

## Requirements

- At least PHP 8.0.x
- OpenTelemetry PHP extension.
- gRPC PHP extension if you want to export in gRPC - otherwise it will use HTTP (works, but slower)
- OTEL collector or similar
- Something to display your traces - we use Grafana with Tempo data source

### Composer packages

- open-telemetry/api
- open-telemetry/sdk
- open-telemetry/exporter-otlp
- php-http/guzzle7-adapter

If you want auto instrumentation database queries:

- open-telemetry/opentelemetry-auto-pdo (MariaDB and Mysql)

Files, input output

- open-telemetry/opentelemetry-auto-io (Redis)

## Environment variables

Example:

```shell
OTEL_SERVICE_NAME=matomo
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_RESOURCE_ATTRIBUTES=host.name=myhost.com
```
