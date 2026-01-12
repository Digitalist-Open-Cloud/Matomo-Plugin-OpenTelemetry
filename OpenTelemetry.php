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

use Piwik\Plugin;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;

/***
 * Main class to create traces.
 */
class OpenTelemetry extends Plugin
{
    private static $activeSpan = null;
    private static $httpSpan = null;
    private static $httpScope = null;

    /**
     * The events we want to create traces from.
     */
    public function registerEvents(): array
    {
        return [
            'Http.sendHttpRequest'     => 'onRequestStart',
            'Http.sendHttpRequest.end' => 'onRequestEnd',
            'API.Request.dispatch'     => 'onApiStart',
            'API.Request.dispatch.end' => 'onApiEnd',
        ];
    }

    /**
     * Request start event.
     */
    public function onRequestStart(): void
    {
        $tracer = Globals::tracerProvider()->getTracer('matomo.http');

        self::$httpSpan = $tracer
            ->spanBuilder(($_SERVER['REQUEST_METHOD'] ?? 'unknown') . ' ' . ($_SERVER['REQUEST_URI'] ?? '/'))
            ->setSpanKind(SpanKind::KIND_CLIENT)
            ->setAttribute('http.url', $_SERVER['REQUEST_URI'] ?? 'unknown')
            ->setAttribute('http.method', $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN')
            ->setStartTimestamp((int) (microtime(true) * 1e9))
            ->startSpan();

        // Activate context so child spans attach automatically
        self::$httpScope = self::$httpSpan->activate();
    }

    /**
     * Request end event.
     */
    public function onRequestEnd(): void
    {
        if (self::$httpSpan) {
            self::$httpSpan->setStatus(
                StatusCode::STATUS_OK
            );
            self::$httpSpan->end((int) (microtime(true) * 1e9));
            self::$httpSpan = null;
        }
    }

    /**
     * API start event.
     */
    public function onApiStart(): void
    {
        $tracer = Globals::tracerProvider()
            ->getTracer('matomo.api');

        self::$activeSpan = $tracer
            ->spanBuilder('API ' . ($_GET['method'] ?? 'unknown'))
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->setAttribute('matomo.api.method', $_GET['method'] ?? 'unknown')
            ->setAttribute('http.method', $_SERVER['REQUEST_METHOD'] ?? 'unknown')
            ->setStartTimestamp((int) (microtime(true) * 1e9))
            ->startSpan();

        // Activate context so child spans attach automatically
        self::$activeSpan->activate();
    }

    /**
     * API end event.
     */
    public function onApiEnd(): void
    {
        if (self::$activeSpan) {
            self::$activeSpan->setAttribute(
                'http.status_code',
                http_response_code() ?: 200
            );
            self::$activeSpan->setStatus(
                StatusCode::STATUS_OK
            );
            self::$activeSpan->end((int) (microtime(true) * 1e9));
            self::$activeSpan = null;
        }
    }
}
