<?php

return [
    'Piwik\View\SecurityPolicy' => Piwik\DI::decorate(function ($policy) {
        /** @var \Piwik\View\SecurityPolicy $policy */

      $policy->addPolicy(
          'default-src',
          "'self'"
      );

      $policy->addPolicy(
          'script-src',
          "'self' 'unsafe-eval'"
      );

      $policy->addPolicy(
          'connect-src',
          "'self' http://127.0.0.1:4318 http://localhost:4318 http://127.0.0.1:4317 http://127.0.0.1:4317"
      );

      $policy->addPolicy(
          'img-src',
          "'self' data:"
      );

      $policy->disable();

        return $policy;
    })
];
