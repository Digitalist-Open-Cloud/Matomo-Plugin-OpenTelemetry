# OTEL collectors

You should use OTEL collector to collect the traces, and the you could send these traces to Tempo, Jaeger or some other services.
These are example configurations if you use docker compose for the services.

## Example configuration for OTEL collector

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp/tempo]
```

## Example configuration for Tempo

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        http:
        grpc:

metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  storage:
    path: /tmp/tempo/generator/wal
  traces_storage:
    path: /tmp/tempo/generator/traces
  processor:
    span_metrics:
      dimensions:
        - service.name
        - span.name
        - http.status_code

storage:
  trace:
    backend: local
    wal:
      path: /tmp/tempo/wal
    local:
      path: /tmp/tempo/blocks

overrides:
  metrics_generator_processors: ["local-blocks]"]
```
