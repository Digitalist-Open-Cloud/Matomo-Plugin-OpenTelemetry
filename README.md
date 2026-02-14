# OpenTelemetry for Matomo

![OpenTelemetry logo](docs/assets/ot.png)

The purpose of this plugin is to measure Matomo itself, how it performs and if there are issues,
like database queries, requests that take a long time, UI response and track errors
in Matomo. It is not involved in tracking by design.

While using OpenTelemetry from Matomo, you can collect issues in your installation of Matomo
that could be hard to catch in any other way.

If you use the plugin both in frontend and in the backend you can collect data about
your Matomo installation that could be hard in other ways.

OpenTelemetry is an open standard that is supported by many vendors, and it is open source.

Please note that this plugin require additional composer packages if you want to collect
telemetry from PHP, which are not included, and needs to be installed together with the
plugin (see further down), also you need the PHP extension OpenTelemetry installed.

For only tracking the frontend (browser usage), all what you need is included, but you still
need a backend to collect the data.

## Configuration

For PHP, use environment variables, for browser, use Matomo System settings.

If you are collecting telemetry from the UI, you must set Context Security Policy (CSP) to allow Matomo
to post data to your collector. To allow it to connect to a collector with URL `https://mytracer.com:4318/v1/traces`
you need to set CSP in plugin settings to: `https://mytracer.com:4318`.

## Requirements

- At least PHP 8.0.x to install plugin.

### OpenTelemetry for PHP

- At least PHP 8.1.x.
- [OpenTelemetry PHP extension](https://github.com/open-telemetry/opentelemetry-php-instrumentation).
- [gRPC](https://en.wikipedia.org/wiki/GRPC) [PHP extension](https://grpc.io/docs/languages/php/quickstart/) if you want to export to a gRPC endpoint - otherwise it will use HTTP (works, but suboptimal if you are collecting a lot of traces). Signoz have an [article](https://signoz.io/comparisons/opentelemetry-grpc-vs-http/) there they compare HTTP and gRPC.

#### Composer packages

- `open-telemetry/api`
- `open-telemetry/sdk`
- `open-telemetry/exporter-otlp`
- `php-http/guzzle7-adapter`

There is also auto-instrumentation libraries, that give you more detailed information.

If you want auto instrumentation database queries:

- `open-telemetry/opentelemetry-auto-pdo` (MariaDB and Mysql)

Files, input output

- `open-telemetry/opentelemetry-auto-io`

Other auto-instrumentation libraries could be found at [Packagist](https://packagist.org/).

#### Environment variables

Example:

```shell
OTEL_SERVICE_NAME=matomo
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=https://mytracer.com:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_RESOURCE_ATTRIBUTES=host.name=myhost.com
```

### Collector

- [OTEL contrib collector](https://github.com/open-telemetry/opentelemetry-collector-contrib) or similar, you can also use self-hosted or SaaS services like [Signoz](https://signoz.io/), [NewRelic](https://newrelic.com/) etc.
or any other provide that supports OpenTelemetry.
- If using OTEL contrib collector, something to store and display your traces - like Grafana with Tempo data source.

## Browser

No other installation than the plugin it self is needed.

OpenTelemetry for browsers is supported, including catching errors, both from
console and from UI error notifications.
Configure which browser telemetry you want to monitor in Admin -> System -> General
settings -> OpenTelemetry.

Client instrumentation in OpenTelemetry for the browser is experimental and mostly
unspecified from the OTEL project, so this part is very experimental, both in this plugin
and the OTEL libraries used.

### Web Vitals

Chrome is the browser that support [Web Vitals](https://web.dev/articles/vitals) the best
(as it is developed by Google), some of the metrics is available in other browsers, like
Firefox. LCP, INP and CLS metrics from Web Vitals is collected by this plugin.

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

## Professional services

If you need help to install the plugin or any other help with Matomo, Digitalist Open Cloud provide
professional services for Matomo, you can contact us at <cloud@digitalist.com>.

## Licenses

- This plugin is licensed under GPL v3+ and copyrighted by [Digitalist Open Cloud](https://digitalist.cloud/).
- The OpenTelemetry PHP and JS packages have a Apache License v2.0 license.
- guzzle7-adapter is MIT licensed.
- Web Vitals have Apache License v2.0 license.

## OpenTelemetry

OpenTelemetry is a [CNCF](https://www.cncf.io/) open source project. Support it.
