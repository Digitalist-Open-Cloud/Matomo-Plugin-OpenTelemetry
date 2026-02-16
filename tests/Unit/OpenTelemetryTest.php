<?php

namespace Piwik\Plugins\OpenTelemetry\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\OpenTelemetry\OpenTelemetry;

class OpenTelemetryTest extends TestCase
{
    public function test_register_events_contains_expected_hooks()
    {
        $plugin = new OpenTelemetry();
        $events = $plugin->registerEvents();

        $this->assertArrayHasKey('Http.sendHttpRequest', $events);
        $this->assertArrayHasKey('Http.sendHttpRequest.end', $events);
        $this->assertArrayHasKey('API.Request.dispatch', $events);
        $this->assertArrayHasKey('API.Request.dispatch.end', $events);
        $this->assertArrayHasKey('Platform.initialized', $events);
        $this->assertArrayHasKey('CronArchive.init.start', $events);
        $this->assertArrayHasKey('CronArchive.end', $events);
    }

    public function test_get_js_files_adds_expected_files()
    {
        $plugin = new OpenTelemetry();
        $files = [];

        $plugin->getJSFiles($files);

        $this->assertContains('plugins/OpenTelemetry/js/start.js', $files);
        $this->assertContains('plugins/OpenTelemetry/js/otel.min.js', $files);
    }

    public function test_add_js_variables_outputs_expected_keys()
    {
        $plugin = new OpenTelemetry();
        $output = '';

        $plugin->addJsVariables($output);

        $this->assertStringContainsString('piwik.openTelemetryEnabled', $output);
        $this->assertStringContainsString('piwik.openTelemetryServiceName', $output);
        $this->assertStringContainsString('piwik.openTelemetryEndpoint', $output);
        $this->assertStringContainsString('piwik.openTelemetryWebVitals', $output);
        $this->assertStringContainsString('piwik.openTelemetryUxMonitoring', $output);
        $this->assertStringContainsString('piwik.openTelemetryResourceAttributes', $output);
    }

    public function test_archive_start_sets_internal_state()
    {
        $plugin = new OpenTelemetry();

        $plugin->onArchiveStart();

        $reflection = new \ReflectionClass(OpenTelemetry::class);
        $property = $reflection->getProperty('archiveStartTime');
        $property->setAccessible(true);

        $this->assertNotNull($property->getValue());
    }

    public function test_archive_end_resets_internal_state()
    {
        $plugin = new OpenTelemetry();

        $plugin->onArchiveStart();
        $plugin->onArchiveEnd();

        $reflection = new \ReflectionClass(OpenTelemetry::class);
        $property = $reflection->getProperty('archiveStartTime');
        $property->setAccessible(true);

        $this->assertNull($property->getValue());
    }
}
