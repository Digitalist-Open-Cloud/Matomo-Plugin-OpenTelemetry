<?php

namespace Piwik\Plugins\OpenTelemetry\Handler;

use Monolog\Handler\AbstractProcessingHandler;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Logs\LogRecord;

class OpenTelemetryHandler extends AbstractProcessingHandler
{
    protected function write(array $record): void
    {
        $otelLogger = Globals::loggerProvider()
          ->getLogger('matomo');

        $attributes = [];
        $attributes['monolog.channel'] = (string) ($record['channel'] ?? 'matomo');
        $attributes['monolog.level']   = (string) ($record['level_name'] ?? 'INFO');

        if (!empty($record['context']) && is_array($record['context'])) {
            foreach ($record['context'] as $key => $value) {
                $key = is_string($key) ? $key : 'context_' . $key;
                if (is_scalar($value)) {
                    $attributes['context.' . $key] = $value;
                } else {
                    $attributes['context.' . $key] = json_encode($value);
                }
            }
        }

        $logRecord = (new LogRecord())
          ->setBody((string) $record['message'])
          ->setSeverityText($record['level_name'])
          ->setSeverityNumber($this->mapLevel($record['level']))
          ->setAttributes($attributes)
          ->setTimestamp(
              (int) ($record['datetime']->getTimestamp() * 1_000_000_000)
          );

        $otelLogger->emit($logRecord);
    }

    private function mapLevel(string $levelName): int
    {
        return match (strtoupper($levelName)) {
            'VERBOSE' => 5,
            'DEBUG'   => 7,
            'INFO'    => 9,
            'WARN'    => 13,
            'ERROR'   => 17,
            default   => 9,
        };
    }
}
