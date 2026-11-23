<?php

/**
 * OpenTelemetry plugin for Matomo.
 *
 * Copyright (C) Digitalist Open Cloud <cloud@digitalist.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Piwik\Plugins\OpenTelemetry;

use Monolog\Logger;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\SpanInterface;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\Context\ScopeInterface;
use Piwik\Container\StaticContainer;
use Piwik\Plugin;
use Piwik\Plugins\OpenTelemetry\Handler\OpenTelemetryHandler;

/**
 * Sends traces, metrics and logs of Matomo itself to OpenTelemetry: a span for each request to
 * Matomo, for each API method it runs and for each request Matomo makes to another server, and
 * the settings the browser needs to send its own.
 */
class OpenTelemetry extends Plugin
{
    public const MASK = '***';

    // Names of values that are never sent: passwords, tokens and keys.
    private const SECRET_NAME = '/pass(word|wd|phrase)?|pwd|token|secret|credential|key|salt|hash|signature|cookie|session|nonce|auth/i';

    private const REQUEST = 'request';
    private const CLIENT = 'client';
    private const API = 'api';

    /**
     * The spans that are open, the innermost last: the span, what detaches it, when it started,
     * what it is a span of and its name.
     *
     * @var array<int, array{0: SpanInterface, 1: ScopeInterface|null, 2: float, 3: string, 4: string}>
     */
    private static $open = [];

    /**
     * @var float|null
     */
    private static $archiveStartTime = null;

    /**
     * @var bool
     */
    private static $endsOnShutdown = false;

    public function registerEvents(): array
    {
        $events = [
            'AssetManager.getJavaScriptFiles' => 'getJSFiles',
            'Template.jsGlobalVariables' => 'addJsVariables',
        ];
        // The packages of OpenTelemetry for PHP are installed apart from the plugin. Without them
        // only the browser is measured.
        if (!self::isInstalledForPhp()) {
            return $events;
        }

        return $events + [
            'Request.dispatch' => 'onRequestStart',
            'Request.dispatch.end' => 'onRequestEnd',
            'Http.sendHttpRequest' => 'onHttpClientStart',
            'Http.sendHttpRequest.end' => 'onHttpClientEnd',
            'API.Request.dispatch' => 'onApiStart',
            'API.Request.dispatch.end' => 'onApiEnd',
            'Platform.initialized' => 'attachOtelHandler',
            'CronArchive.init.start' => 'onArchiveStart',
            'CronArchive.end' => 'onArchiveEnd',
        ];
    }

    public static function isInstalledForPhp(): bool
    {
        return class_exists(Globals::class);
    }

    /**
     * Sends what Matomo logs to OpenTelemetry as well.
     */
    public function attachOtelHandler(): void
    {
        $logger = StaticContainer::get('Psr\Log\LoggerInterface');
        if ($logger instanceof Logger) {
            $logger->pushHandler(new OpenTelemetryHandler(Logger::DEBUG));
        }
    }

    /**
     * A request to Matomo starts. The span continues the trace of the caller when the request
     * carries one.
     */
    public function onRequestStart($module = '', $action = ''): void
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (is_string($value) && strpos($key, 'HTTP_') === 0) {
                $headers[strtolower(str_replace('_', '-', substr($key, 5)))] = $value;
            }
        }
        $method = self::toText($_SERVER['REQUEST_METHOD'] ?? 'unknown');

        $span = Globals::tracerProvider()->getTracer('matomo.http')
            ->spanBuilder($method . ' ' . self::toText($module) . '.' . self::toText($action))
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->setParent(Globals::propagator()->extract($headers))
            ->setAttribute('http.method', $method)
            ->setAttribute('http.url', self::maskSecrets(self::toText($_SERVER['REQUEST_URI'] ?? '')))
            ->setAttribute('matomo.module', self::toText($module))
            ->setAttribute('matomo.action', self::toText($action))
            ->startSpan();

        self::open($span, self::REQUEST, '');

        // A request that ends with exit() never reaches the end of the dispatch.
        if (!self::$endsOnShutdown) {
            self::$endsOnShutdown = true;
            register_shutdown_function([self::class, 'endAll']);
        }
    }

    public function onRequestEnd(): void
    {
        $peakMemory = memory_get_peak_usage(true);
        Globals::meterProvider()->getMeter('matomo.php')
            ->createHistogram('matomo.php.memory.peak', 'By', 'Peak PHP memory usage per request')
            ->record($peakMemory, ['process.runtime.name' => PHP_SAPI]);

        self::close(self::REQUEST, ['php.memory.peak' => $peakMemory, 'http.status_code' => http_response_code() ?: 200]);
    }

    /**
     * Matomo asks another server for something.
     */
    public function onHttpClientStart($url = '', $parameters = []): void
    {
        $url = self::toText($url);
        $method = self::toText(is_array($parameters) ? ($parameters['httpMethod'] ?? 'GET') : 'GET');

        $span = Globals::tracerProvider()->getTracer('matomo.http')
            ->spanBuilder($method . ' ' . (parse_url($url, PHP_URL_HOST) ?: 'unknown'))
            ->setSpanKind(SpanKind::KIND_CLIENT)
            ->setAttribute('http.method', $method)
            ->setAttribute('http.url', self::maskSecrets($url))
            ->startSpan();

        self::open($span, self::CLIENT, '');
    }

    public function onHttpClientEnd($url = '', $parameters = [], $response = null, $status = null): void
    {
        self::close(self::CLIENT, is_numeric($status) ? ['http.status_code' => (int) $status] : []);
    }

    /**
     * Matomo runs a method of its API. One request can run several, also inside one another.
     */
    public function onApiStart($parameters = [], $plugin = '', $method = ''): void
    {
        $name = self::toText($plugin) . '.' . self::toText($method);

        $span = Globals::tracerProvider()->getTracer('matomo.api')
            ->spanBuilder('API ' . $name)
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute('matomo.api.method', $name)
            ->startSpan();

        self::open($span, self::API, $name);
    }

    public function onApiEnd($returnedValue = null, $call = []): void
    {
        $name = is_array($call) ? self::toText($call['module'] ?? '') . '.' . self::toText($call['action'] ?? '') : '';
        $index = self::find(self::API, $name);
        if ($index === null) {
            return;
        }

        Globals::meterProvider()->getMeter('matomo.api')
            ->createHistogram('matomo.api.request.duration', 'ms', 'Duration of Matomo API requests')
            ->record((microtime(true) - self::$open[$index][2]) * 1000, ['matomo.api.method' => $name]);

        self::close(self::API, [], $name);
    }

    public function onArchiveStart(): void
    {
        self::$archiveStartTime = microtime(true);
    }

    public function onArchiveEnd(): void
    {
        if (self::$archiveStartTime === null) {
            return;
        }

        $meter = Globals::meterProvider()->getMeter('matomo.archive');
        $meter->createHistogram('matomo.archive.duration', 'ms', 'Duration of Matomo core archive runs')
            ->record((microtime(true) - self::$archiveStartTime) * 1000, ['process.runtime.name' => PHP_SAPI]);
        $meter->createCounter('matomo.archive.runs', '1', 'Number of archive runs')->add(1);

        self::$archiveStartTime = null;
    }

    /**
     * Ends the spans that are still open, the innermost first.
     */
    public static function endAll(): void
    {
        while (self::$open) {
            self::close(end(self::$open)[3], []);
        }
    }

    /**
     * An address without the values of its parameters that are secret, such as token_auth.
     */
    public static function maskSecrets(string $url): string
    {
        $parts = explode('?', $url, 2);
        if (!isset($parts[1])) {
            return $url;
        }
        [$query, $fragment] = explode('#', $parts[1], 2) + ['', null];

        $pairs = [];
        foreach (explode('&', $query) as $pair) {
            [$name, $value] = explode('=', $pair, 2) + ['', null];
            $isSecret = $value !== null && preg_match(self::SECRET_NAME, rawurldecode($name));
            $pairs[] = $isSecret ? $name . '=' . self::MASK : $pair;
        }

        return $parts[0] . '?' . implode('&', $pairs) . ($fragment === null ? '' : '#' . $fragment);
    }

    /**
     * @param string $name the name of a value in the context of a log entry
     */
    public static function isSecretName(string $name): bool
    {
        return preg_match(self::SECRET_NAME, $name) === 1;
    }

    private static function open(SpanInterface $span, string $type, string $name): void
    {
        // What Matomo does next belongs to the span, except for a request to another server,
        // which is over when Matomo goes on.
        self::$open[] = [$span, $type === self::CLIENT ? null : $span->activate(), microtime(true), $type, $name];
    }

    /**
     * @return int|null where the innermost open span of the type is, with the name when it has one
     */
    private static function find(string $type, string $name): ?int
    {
        $ofType = null;
        for ($index = count(self::$open) - 1; $index >= 0; $index--) {
            if (self::$open[$index][3] !== $type) {
                continue;
            }
            if (self::$open[$index][4] === $name) {
                return $index;
            }
            $ofType = $ofType ?? $index;
        }

        return $ofType;
    }

    /**
     * Ends an open span, and the spans opened inside it that were never ended, as when an API
     * method throws.
     *
     * @param array<string, int|string> $attributes for the span
     */
    private static function close(string $type, array $attributes, string $name = ''): void
    {
        $index = self::find($type, $name);
        if ($index === null) {
            return;
        }

        while (count(self::$open) > $index) {
            [$span, $scope] = array_pop(self::$open);
            if ($scope !== null) {
                $scope->detach();
            }
            if (count(self::$open) === $index) {
                foreach ($attributes as $key => $value) {
                    $span->setAttribute($key, $value);
                }
                $span->setStatus(StatusCode::STATUS_OK);
            } else {
                $span->setStatus(StatusCode::STATUS_ERROR, 'Not ended');
            }
            $span->end();
        }
    }

    /**
     * @param mixed $value
     */
    private static function toText($value): string
    {
        return is_scalar($value) ? (string) $value : '';
    }

    public function getJSFiles(&$files)
    {
        $files[] = 'plugins/OpenTelemetry/js/start.js';
        $files[] = 'plugins/OpenTelemetry/js/otel.min.js';
    }

    /**
     * Gives the browser the settings of its telemetry.
     */
    public function addJsVariables(&$out)
    {
        $settings = new SystemSettings();
        $variables = [
            'openTelemetryEnabled' => (bool) $settings->enabled->getValue(),
            'openTelemetryServiceName' => (string) $settings->serviceName->getValue(),
            'openTelemetryEndpoint' => (string) $settings->otelEndpoint->getValue(),
            'openTelemetryDocumentLoadMonitoring' => (bool) $settings->enableDocumentLoadMonitoring->getValue(),
            'openTelemetryUserInteractionMonitoring' => (bool) $settings->enableUserInteractionMonitoring->getValue(),
            'openTelemetryXMLHttpRequestMonitoring' => (bool) $settings->enableXMLHttpRequestMonitoring->getValue(),
            'openTelemetryWebVitals' => (bool) $settings->enableWebVitals->getValue(),
            'openTelemetryUxMonitoring' => (bool) $settings->enableUxMonitoring->getValue(),
            'openTelemetryResourceAttributes' => (string) $settings->resourceAttributes->getValue(),
        ];

        foreach ($variables as $name => $value) {
            $out .= "piwik.$name = " . json_encode($value, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) . ";\n";
        }
    }
}
