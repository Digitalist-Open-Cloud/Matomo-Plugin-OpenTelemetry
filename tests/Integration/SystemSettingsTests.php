<?php

namespace Piwik\Plugins\OpenTelemetry\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\OpenTelemetry\SystemSettings;
use Piwik\Settings\FieldConfig;

class SystemSettingsTests extends TestCase
{
    private function createSettings(): SystemSettings
    {
        return new SystemSettings();
    }

    public function test_all_settings_are_initialized()
    {
        $settings = $this->createSettings();

        $this->assertNotNull($settings->enabled);
        $this->assertNotNull($settings->cspConnectSrc);
        $this->assertNotNull($settings->serviceName);
        $this->assertNotNull($settings->otelEndpoint);
        $this->assertNotNull($settings->enableWebVitals);
        $this->assertNotNull($settings->enableUxMonitoring);
        $this->assertNotNull($settings->enableDocumentLoadMonitoring);
        $this->assertNotNull($settings->enableUserInteractionMonitoring);
        $this->assertNotNull($settings->enableXMLHttpRequestMonitoring);
        $this->assertNotNull($settings->resourceAttributes);
    }

    public function test_default_values()
    {
        $settings = $this->createSettings();

        $this->assertFalse($settings->enabled->getValue());
        $this->assertSame('', $settings->cspConnectSrc->getValue());
        $this->assertSame('matomo-frontend', $settings->serviceName->getValue());
        $this->assertSame('', $settings->otelEndpoint->getValue());
        $this->assertFalse($settings->enableWebVitals->getValue());
        $this->assertFalse($settings->enableUxMonitoring->getValue());
        $this->assertFalse($settings->enableDocumentLoadMonitoring->getValue());
        $this->assertFalse($settings->enableUserInteractionMonitoring->getValue());
        $this->assertFalse($settings->enableXMLHttpRequestMonitoring->getValue());
        $this->assertSame('', $settings->resourceAttributes->getValue());
    }

    public function test_field_types()
    {
        $settings = $this->createSettings();

        $this->assertSame(FieldConfig::TYPE_BOOL, $settings->enabled->getField()->type);
        $this->assertSame(FieldConfig::TYPE_STRING, $settings->serviceName->getField()->type);
        $this->assertSame(FieldConfig::TYPE_STRING, $settings->otelEndpoint->getField()->type);
        $this->assertSame(FieldConfig::TYPE_STRING, $settings->resourceAttributes->getField()->type);
    }

    public function test_boolean_settings_have_condition_enabled()
    {
        $settings = $this->createSettings();

        $this->assertSame('enabled', $settings->enableWebVitals->getField()->condition);
        $this->assertSame('enabled', $settings->enableUxMonitoring->getField()->condition);
        $this->assertSame('enabled', $settings->enableDocumentLoadMonitoring->getField()->condition);
        $this->assertSame('enabled', $settings->enableUserInteractionMonitoring->getField()->condition);
        $this->assertSame('enabled', $settings->enableXMLHttpRequestMonitoring->getField()->condition);
    }
}
