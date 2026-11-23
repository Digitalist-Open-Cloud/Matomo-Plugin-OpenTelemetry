<?php

namespace Piwik\Plugins\OpenTelemetry\tests\Integration;

use Exception;
use Monolog\Logger;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\Propagation\TraceContextPropagator;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\Context\Context;
use OpenTelemetry\SDK\Logs\Exporter\InMemoryExporter as InMemoryLogExporter;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;
use OpenTelemetry\SDK\Sdk;
use OpenTelemetry\SDK\Trace\SpanExporter\InMemoryExporter;
use OpenTelemetry\SDK\Trace\SpanProcessor\SimpleSpanProcessor;
use OpenTelemetry\SDK\Trace\TracerProvider;
use Piwik\Plugins\OpenTelemetry\Handler\OpenTelemetryHandler;
use Piwik\Plugins\OpenTelemetry\OpenTelemetry;
use Piwik\Plugins\OpenTelemetry\SystemSettings;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * @group OpenTelemetry
 * @group Plugins
 */
class TelemetryTest extends IntegrationTestCase
{
    private const TRACE_ID = '0af7651916cd43dd8448eb211c80319c';

    /**
     * @var InMemoryExporter
     */
    private $spans;

    /**
     * @var InMemoryLogExporter
     */
    private $logs;

    /**
     * @var array<string, mixed>
     */
    private $server;

    public function setUp(): void
    {
        parent::setUp();

        // The packages of OpenTelemetry for PHP are installed apart from the plugin.
        if (!class_exists(Sdk::class)) {
            $this->markTestSkipped('The OpenTelemetry SDK for PHP is not installed.');
        }

        $this->server = $_SERVER;
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $this->spans = new InMemoryExporter();
        $this->logs = new InMemoryLogExporter();
        Globals::reset();
        Sdk::builder()
            ->setTracerProvider(new TracerProvider(new SimpleSpanProcessor($this->spans)))
            ->setLoggerProvider(LoggerProvider::builder()->addLogRecordProcessor(new SimpleLogRecordProcessor($this->logs))->build())
            ->setPropagator(TraceContextPropagator::getInstance())
            ->buildAndRegisterGlobal();
    }

    public function tearDown(): void
    {
        if (class_exists(Sdk::class)) {
            OpenTelemetry::endAll();
            Globals::reset();
            $_SERVER = $this->server;
        }

        parent::tearDown();
    }

    protected static function configureFixture($fixture)
    {
        parent::configureFixture($fixture);

        $fixture->extraPluginsToLoad = ['OpenTelemetry'];
    }

    public function testARequestToMatomoIsASpanWithoutItsSecrets()
    {
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_SERVER['REQUEST_URI'] = '/index.php?module=API&method=VisitsSummary.get&idSite=1&token_auth=abc123&password=hunter2&date=today';
        $_SERVER['HTTP_TRACEPARENT'] = '00-' . self::TRACE_ID . '-b7ad6b7169203331-01';
        $plugin = new OpenTelemetry();
        $root = Context::getCurrent();

        $plugin->onRequestStart('API', 'index');
        $this->assertNotSame($root, Context::getCurrent(), 'What Matomo does next belongs to the span.');
        $plugin->onRequestEnd();

        $this->assertSame($root, Context::getCurrent(), 'Nothing is left active.');
        $span = array_values($this->getSpans())[0];
        $this->assertSame(['GET API.index', SpanKind::KIND_SERVER, self::TRACE_ID, 'b7ad6b7169203331'], [$span->getName(), $span->getKind(), $span->getTraceId(), $span->getParentSpanId()]);
        $attributes = $span->getAttributes()->toArray();
        $this->assertSame('/index.php?module=API&method=VisitsSummary.get&idSite=1&token_auth=***&password=***&date=today', $attributes['http.url']);
        $this->assertSame(['GET', 'API', 'index'], [$attributes['http.method'], $attributes['matomo.module'], $attributes['matomo.action']]);
        $this->assertStringNotContainsString('abc123', json_encode([$span->getName(), $attributes]));
    }

    public function testApiMethodsAreSpansInsideTheRequestAndInsideOneAnother()
    {
        $plugin = new OpenTelemetry();

        $plugin->onRequestStart('API', 'index');
        $plugin->onApiStart([], 'API', 'getProcessedReport');
        $plugin->onApiStart([], 'VisitsSummary', 'get');
        $plugin->onApiEnd(null, ['module' => 'VisitsSummary', 'action' => 'get']);
        $plugin->onApiEnd(null, ['module' => 'API', 'action' => 'getProcessedReport']);
        $plugin->onRequestEnd();

        $spans = $this->getSpans();
        $this->assertSame(['API VisitsSummary.get', 'API API.getProcessedReport', 'GET API.index'], array_keys($spans));
        $this->assertSame($spans['API API.getProcessedReport']->getSpanId(), $spans['API VisitsSummary.get']->getParentSpanId());
        $this->assertSame($spans['GET API.index']->getSpanId(), $spans['API API.getProcessedReport']->getParentSpanId());
        $this->assertSame('VisitsSummary.get', $spans['API VisitsSummary.get']->getAttributes()->get('matomo.api.method'));
    }

    public function testAnApiMethodThatThrowsDoesNotLeaveItsSpanOpen()
    {
        $plugin = new OpenTelemetry();
        $root = Context::getCurrent();

        $plugin->onRequestStart('API', 'index');
        $plugin->onApiStart([], 'API', 'getProcessedReport');
        // Throws, so Matomo never tells that it ended.
        $plugin->onApiStart([], 'VisitsSummary', 'get');
        $plugin->onApiEnd(null, ['module' => 'API', 'action' => 'getProcessedReport']);
        $plugin->onRequestEnd();

        $spans = $this->getSpans();
        $this->assertSame($root, Context::getCurrent());
        $this->assertSame(
            [StatusCode::STATUS_ERROR, StatusCode::STATUS_OK, StatusCode::STATUS_OK],
            [$spans['API VisitsSummary.get']->getStatus()->getCode(), $spans['API API.getProcessedReport']->getStatus()->getCode(), $spans['GET API.index']->getStatus()->getCode()]
        );
    }

    public function testARequestThatExitsIsEndedAtShutdown()
    {
        $plugin = new OpenTelemetry();
        $plugin->onRequestStart('CoreHome', 'index');
        $plugin->onApiStart([], 'API', 'get');

        OpenTelemetry::endAll();

        $this->assertSame(['API API.get', 'GET CoreHome.index'], array_keys($this->getSpans()));
    }

    public function testARequestOfMatomoToAnotherServerIsAClientSpan()
    {
        $plugin = new OpenTelemetry();
        $url = 'https://plugins.matomo.org/api/2.0/plugins?access_token=abc123&query=x';

        $plugin->onRequestStart('Marketplace', 'overview');
        $plugin->onHttpClientStart($url, ['httpMethod' => 'POST']);
        $plugin->onHttpClientEnd($url, ['httpMethod' => 'POST'], 'body', 503);
        $plugin->onRequestEnd();

        $spans = $this->getSpans();
        $client = $spans['POST plugins.matomo.org'];
        $this->assertSame([SpanKind::KIND_CLIENT, $spans['GET Marketplace.overview']->getSpanId()], [$client->getKind(), $client->getParentSpanId()]);
        $this->assertSame(
            ['http.method' => 'POST', 'http.url' => 'https://plugins.matomo.org/api/2.0/plugins?access_token=***&query=x', 'http.status_code' => 503],
            $client->getAttributes()->toArray()
        );
    }

    /**
     * @dataProvider getAddresses
     */
    public function testSecretsAreMaskedInAnAddress(string $url, string $masked)
    {
        $this->assertSame($masked, OpenTelemetry::maskSecrets($url));
    }

    public function getAddresses(): array
    {
        return [
            'no parameters' => ['/index.php', '/index.php'],
            'nothing secret' => ['/index.php?module=CoreHome&idSite=1', '/index.php?module=CoreHome&idSite=1'],
            'a token' => ['/?token_auth=abc&x=1', '/?token_auth=***&x=1'],
            'an encoded name' => ['/?token%5Fauth=abc', '/?token%5Fauth=***'],
            'several, with a fragment' => ['/?a=1&apiKey=k&PASSWORD=p#top', '/?a=1&apiKey=***&PASSWORD=***#top'],
            'a name without a value' => ['/?token_auth&x=1', '/?token_auth&x=1'],
            'an empty query' => ['/?', '/?'],
        ];
    }

    public function testALogEntryIsSentWithoutSecretsInItsContext()
    {
        $logger = new Logger('matomo', [new OpenTelemetryHandler(Logger::DEBUG)]);

        $logger->warning('Could not reach the server', ['token_auth' => 'abc123', 'password' => 'hunter2', 'idSite' => 3, 'list' => ['a', 'b']]);

        $records = $this->logs->getStorage();
        $this->assertCount(1, $records);
        $attributes = $records[0]->getAttributes()->toArray();
        $this->assertSame('Could not reach the server', $records[0]->getBody());
        $this->assertSame(['***', '***', 3, '["a","b"]'], [$attributes['context.token_auth'], $attributes['context.password'], $attributes['context.idSite'], $attributes['context.list']]);
    }

    public function testTheSettingsOfTheBrowserCannotEndTheScriptTheyAreWrittenIn()
    {
        $settings = new SystemSettings();
        $settings->serviceName->setValue('</script><script>alert(1)</script>');
        $settings->save();

        $script = '';
        (new OpenTelemetry())->addJsVariables($script);

        $this->assertStringNotContainsString('</script>', $script);
        $this->assertStringContainsString('piwik.openTelemetryServiceName = "' . chr(92) . 'u003C', $script);
        $this->assertStringContainsString("piwik.openTelemetryEnabled = false;\n", $script);
    }

    /**
     * @dataProvider getSettings
     */
    public function testTheAddressesOfTheSettingsAreChecked(string $setting, string $value, bool $isAccepted)
    {
        $settings = new SystemSettings();

        try {
            $settings->$setting->setValue($value);
            $this->assertTrue($isAccepted, $value . ' was accepted.');
        } catch (Exception $e) {
            $this->assertFalse($isAccepted, $value . ' was refused: ' . $e->getMessage());
        }
    }

    public function getSettings(): array
    {
        return [
            ['otelEndpoint', '', true],
            ['otelEndpoint', 'https://collector.example.org:4318/v1/traces', true],
            ['otelEndpoint', 'http://127.0.0.1:4318', true],
            ['otelEndpoint', 'javascript:alert(1)', false],
            ['otelEndpoint', '//collector.example.org', false],
            ['otelEndpoint', 'collector.example.org', false],
            ['cspConnectSrc', '', true],
            ['cspConnectSrc', 'https://collector.example.org:4318', true],
            ['cspConnectSrc', 'http://127.0.0.1:4318 https://*.example.org', true],
            ['cspConnectSrc', "https://collector.example.org; script-src 'unsafe-inline'", false],
            ['cspConnectSrc', "'unsafe-inline'", false],
            ['cspConnectSrc', 'https://collector.example.org/v1/traces', false],
            ['cspConnectSrc', "https://a.example.org\nX-Injected: 1", false],
        ];
    }

    /**
     * @return array<string, \OpenTelemetry\SDK\Trace\ImmutableSpan> the ended spans by name, in the order they ended
     */
    private function getSpans(): array
    {
        $spans = [];
        foreach ($this->spans->getSpans() as $span) {
            $spans[$span->getName()] = $span;
        }

        return $spans;
    }
}
