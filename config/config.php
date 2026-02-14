<?php

return [
    'Piwik\View\SecurityPolicy' => Piwik\DI::decorate(function ($policy) {
        /** @var \Piwik\View\SecurityPolicy $policy */

        if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
            return $policy;
        }

        $settings = new Piwik\Plugins\OpenTelemetry\SystemSettings();
        $cspDomains = $settings->getSetting('cspConnectSrc')->getValue();

        if (isset($cspDomains)) {
            $policy->addPolicy(
                'connect-src',
                "'self' $cspDomains"
            );
        }

        return $policy;
    })
];
