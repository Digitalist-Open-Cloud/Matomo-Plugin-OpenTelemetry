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

use Piwik\Piwik;
use Piwik\Settings\Setting;
use Piwik\Settings\FieldConfig;
use Piwik\Settings\Plugin\SystemSettings as MatomoSettings;

class SystemSettings extends MatomoSettings
{

    /** @var Setting */
    public $serviceName;

    /** @var Setting */
    public $otelEndpoint;

    /** @var Setting */
    public $otelPort;

    /** @var Setting */
    public $enabled;

    /** @var Setting */
    public $enableWebVitals;

    /** @var Setting */
    public $enableUxMonitoring;

    protected function init()
    {
        $this->enabled = $this->enabledSetting();
        $this->serviceName = $this->serviceNameSetting();
        $this->otelEndpoint = $this->otelEndpointSetting();
        $this->otelPort = $this->otelPortSetting();
        $this->enableWebVitals = $this->webVitalsSetting();
        $this->enableUxMonitoring = $this->uxMonitoringSetting();
    }

    private function enabledSetting()
    {
        return $this->makeSetting(
            'enabled',
            true,
            FieldConfig::TYPE_BOOL,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_Enabled');
                $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
                $field->description = Piwik::translate(
                    'OpenTelemetry_EnabledDescription'
                );
            }
        );
    }

    private function serviceNameSetting()
    {
        return $this->makeSetting(
            'serviceName',
            'matomo-frontend',
            FieldConfig::TYPE_STRING,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_ServiceName');
                $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
                $field->description = Piwik::translate(
                    'OpenTelemetry_ServiceNameDescription'
                );
            }
        );
    }

    private function otelEndpointSetting()
    {
        return $this->makeSetting(
            'otelEndpoint',
            'https://otel.example.com',
            FieldConfig::TYPE_STRING,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_OtelEndpoint');
                $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
                $field->description = Piwik::translate(
                    'OpenTelemetry_OtelEndpointDescription'
                );
            }
        );
    }

    private function otelPortSetting()
    {
        return $this->makeSetting(
            'otelPort',
            4318,
            FieldConfig::TYPE_INT,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_OtelPort');
                $field->uiControl = FieldConfig::UI_CONTROL_TEXT;
                $field->description = Piwik::translate(
                    'OpenTelemetry_OtelPortDescription'
                );
            }
        );
    }

    private function webVitalsSetting()
    {
        return $this->makeSetting(
            'enableWebVitals',
            true,
            FieldConfig::TYPE_BOOL,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_EnableWebVitals');
                $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
                $field->description = Piwik::translate(
                    'OpenTelemetry_EnableWebVitalsDescription'
                );
                $field->condition = 'enabled';
            }
        );
    }

    private function uxMonitoringSetting()
    {
        return $this->makeSetting(
            'enableUxMonitoring',
            true,
            FieldConfig::TYPE_BOOL,
            function (FieldConfig $field) {
                $field->title = Piwik::translate('OpenTelemetry_EnableUxMonitoring');
                $field->uiControl = FieldConfig::UI_CONTROL_CHECKBOX;
                $field->description = Piwik::translate(
                    'OpenTelemetry_EnableUxMonitoringDescription'
                );
                $field->condition = 'enabled';
            }
        );
    }
}
