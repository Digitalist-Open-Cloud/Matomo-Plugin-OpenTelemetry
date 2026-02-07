# OpenTelemetry for Matomo

OpenTelemetry plugin for Matomo.

Traces API, requests (PHP) and browser (JS).

Please note that this plugin require additional composer packages, which are not included,
and needs to be installed together with the plugin. Also it needs the PHP extension OpenTelemetry.

## Configuration

For PHP, use environment variables, for browser, use Matomo System settings.

## Requirements

- At least PHP 8.0.x to install plugin.

### For OpenTelemetry for PHP

- At least PHP 8.1.x.
- OpenTelemetry PHP extension.
- gRPC PHP extension if you want to export in gRPC - otherwise it will use HTTP (works, but slower)

#### Composer packages

- open-telemetry/api
- open-telemetry/sdk
- open-telemetry/exporter-otlp
- php-http/guzzle7-adapter

If you want auto instrumentation database queries:

- open-telemetry/opentelemetry-auto-pdo (MariaDB and Mysql)

Files, input output

- open-telemetry/opentelemetry-auto-io

#### Environment variables

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

### Collector

- OTEL contrib collector or similar
- Something to store and display your traces - we use Grafana with Tempo data source.

## Browser

OpenTelemetry for browsers is supported, including catching errors, both from
console and from UI error notifications.
Configure which, browser telemetry you want to monitor in Admin -> System -> General
settings -> Open Telemetry.

Client instrumentation from OpenTelemetry for the browser is experimental and mostly
unspecified from the project, so this part is very experimental.

### Web Vitals

Chrome is the browser that support Web vitals the best, some of the metrics is though also
available in other browsers, like Firefox. Limited Web Vitals are so far collected by this
plugin.

## Development

### For PHP

Install needed composer packages (see above).

### For browser

OpenTelemetry for browsers is still in a experiment state, and everything can change.

At least Node JS 20 is required.

To build release js-files:

```shell
npm install
npx esbuild src/otel.js \
  --bundle \
  --sourcemap \
  --format=iife \
  --target=es2018 \
  --outfile=js/otel.js

npx esbuild src/otel.js \
  --bundle \
  --minify \
  --format=iife \
  --target=es2018 \
  --outfile=js/otel.min.js

```

## Software Bill of Materials (SBOM)

SBOMs for the javascript dependencies are in directory `sbom`. For PHP packages, this is not included,
as this is not part of the distribution of this plugin. Also, versions and dependencies depends on your setup.
Trivy has been used to generate the SBOMs.

## Licenses

- This plugin is license under GPL v3+.
- The Open Telemetry PHP and JS packages have Apache License v2.0 license.
- guzzle7-adapter is MIT licensed.
- Web vitals have Apache License v2.0 license.
