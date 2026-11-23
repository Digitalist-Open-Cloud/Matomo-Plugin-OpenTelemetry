#!/bin/bash
# Installs the packages of OpenTelemetry for PHP into the Matomo the tests run in. Runs in the
# Matomo directory. Without them the tests of the PHP telemetry skip.
set -u

composer require --no-interaction --no-progress --ignore-platform-reqs \
  open-telemetry/api open-telemetry/sdk \
  || echo "Could not install OpenTelemetry for PHP, its tests will be skipped."
