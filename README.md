# NestJs Metrics Module

[![HitCount](http://hits.dwyl.com/mists-aside/nestjs-metrics.svg)](http://hits.dwyl.com/mists-aside/nestjs-metrics)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/mists-aside/nestjs-metrics/issues)
[![TravisCI](https://travis-ci.org/mists-aside/nestjs-metrics.svg?branch=master)](https://travis-ci.org/mists-aside/nestjs-metrics)
![JSCPD](.jscpd/jscpd-badge.svg?raw=true)
<!-- CI Badges -->
<!-- [![CircleCI](https://circleci.com/gh/mists-aside/nestjs-metrics.svg?style=shield)](https://circleci.com/gh/mists-aside/nestjs-metrics) -->

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=mists-aside_nestjs-metrics&metric=alert_status)](https://sonarcloud.io/dashboard?id=mists-aside_nestjs-metrics)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=mists-aside_nestjs-metrics&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=mists-aside_nestjs-metrics)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=mists-aside_nestjs-metrics&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=mists-aside_nestjs-metrics)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=mists-aside_nestjs-metrics&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=mists-aside_nestjs-metrics)

<!-- Donation Badges -->
[![Donate to this project using Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://patreon.com/dragoscirjan)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QBP6DEBJDEMV2&source=url)

> *What's measured improves* - Peter Drucker

> *@mists/nestjs-metrics* desires to be a collection of metric modules adapted for the implementation and usage of
> metrics within NodeJs projects.

<!-- TOC -->

- [NestJs Metrics Module](#nestjs-metrics-module)
  - [Getting Started](#getting-started)
    - [Prerequisites / Dependencies](#prerequisites--dependencies)
    - [Installation](#installation)
    - [Development](#development)
      - [Requirements](#requirements)
    - [Testing](#testing)
      - [Single Tests](#single-tests)
    - [Deployment](#deployment)
  - [Documentation](#documentation)
    - [API](#api)
    - [Metrics](#metrics)
      - [Counter](#counter)
      - [Gauge](#gauge)
      - [Histogram](#histogram)
      - [Summary](#summary)
    - [Registering Module](#registering-module)
    - [Registering Metrics](#registering-metrics)
    - [Registering Metrics Controller](#registering-metrics-controller)
    - [Metric Decorators](#metric-decorators)
  - [Authors](#authors)
  - [Issues / Support](#issues--support)
  - [License](#license)

<!-- /TOC -->

## Getting Started

### Prerequisites / Dependencies

Depends on the following modules:

* [node-statsd-client](https://github.com/msiebuhr/node-statsd-client) (with the additonal `@types/node-statsd-client` for TypeScript)
* [prom-client](https://github.com/siimon/prom-client)

### Installation

```bash
npm install -S @mists/nestjs-metrics
# yarn add @mists/nestjs-metrics
```

### Development

```bash
git clone https://github.com/mists-aside/nestjs-metrics your_project
cd your_project
rm -rf .git
git init
git add remote origin https://url/to/your/project/repository
git add .
git commit -am "init"
git push origin master
npm run change:language -- javascript # to use javascript
# or
# npm run change:language -- typescript # to use typescript
npm install
# yarn install
# pnpm install
```

#### Requirements

- Please install [NodeJs](https://nodejs.org/en/). We support version 10.x and above.
- Please instal a JavaScript/TypeScript IDE
  - [Visual Studio Code](https://code.visualstudio.com/) with [ITMCDev Babel Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-babel-extension-pack) or [ITMCDev TypeScript Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-typescript-extension-pack)
  - [Jetbrains WebStorm](https://www.jetbrains.com/webstorm/)
  - [Vim](https://www.vim.org/) with [neoclide/coc.nvim](https://github.com/neoclide/coc.nvim) and [HerringtonDarkholme/yats.vim](https://github.com/HerringtonDarkholme/yats.vim) extensions.
  - Any other IDE you trust.


### Testing

Run unit tests using `npm run test`.

Testing is currently set to use unittest.

#### Single Tests

Run single unit tests file, by calling `make test:single -- test/path/to/file.test.js`

```bash
make test:single -- test/path/to/index.test.js
```

### Deployment

Please check [release-it](https://www.npmjs.com/package/release-it) for making releases to [npmjs.com](https://www.npmjs.com/) or any other repository tool, then run:

```bash
npm run release
```

## Documentation

### API

For a better understanding of the API, the the following [API documentation](https://mists-aside.github.io/nestjs-metrics).

### Metrics

<!-- TODO: -->

#### Counter

[Counters](https://mists-aside.github.io/nestjs-metrics/classes/counter.html) are used for counting events. They can only grow, never decrease or reset.

Reflected by
* [`PromClient.Counter`](https://github.com/siimon/prom-client#counter)
* [`StatsdClient.increment`](https://github.com/msiebuhr/node-statsd-client#counting-stuff)

#### Gauge

[Gauges](https://mists-aside.github.io/nestjs-metrics/classes/gauge.html) are used for counting events (with the possibility of decreasing or resetting a value as well) and for timing them

Reflected by
* [`PromClient.Gauge`](https://github.com/siimon/prom-client#gauge)
* [`StatsdClient.gauge` and `StatsdClient.gaugeDelta`](https://github.com/msiebuhr/node-statsd-client#gauges) and [`StatsdClient.timing`](https://github.com/msiebuhr/node-statsd-client#delays)

#### Histogram

[Histograms](https://mists-aside.github.io/nestjs-metrics/classes/histogram.html) are similar to Gauge, but used for tracking sized and frequency of events

Reflected by 
* [`PromClient.Histogram`](https://github.com/siimon/prom-client#histogram)
* StatsD does not know the concept of summary, so we emulated it using the `StatsDClient.histogram` methods.

#### Summary

[Summaries](https://mists-aside.github.io/nestjs-metrics/classes/summary.html) are similar to Histogram, but used to calculate percentiles of observed values

Reflected by
* [`PromClient.Summary`](https://github.com/siimon/prom-client#summary)
* on the side of `statsd`, to support compatibility (not sure if it's good or bad, yet), the same methods as for `Histogram`

### Registering Module

**Using (sync) `register()` method**:

```javascript
@Module({
  imports: [MetricsModule.register({/* ... */})],
})
export class AppModule {}
```

**Using async `registerAsync()` method**:

```javascript
import { Module } from "@nestjs/common";
import { MetricsModule } from "@mists/nestjs-metrics";

@Injectable()
export class StatsOptionsService implements StatsOptionsFactory {
  createStatsOptions(): StatsOptions {
    return new Promise(resolve => ({
      /* see the MetricsModule::register() options */
    }));
  }
}

@Module({
  imports: [MetricsModule.registerAsync({
    useClass: StatsOptionsService,
    inject: [StatsOptionsService],
  })],
})
export class AppModule {}
```

### Registering Metrics

You will need to create a metric provider first. This will be done using the 
[`makeMetricProvider`](https://mists-aside.github.io/nestjs-metrics/index.html#makemetricprovider) method.

See more details about [MetricsModuleOptions](https://mists-aside.github.io/nestjs-metrics/interfaces/metricsmoduleoptions.html) before you continue. 

```javascript
import { Module } from "@nestjs/common";
import { MetricsModule, MetricsController, Counter,  } from "@mists/nestjs-metrics";

@Module({
  controllers: [MetricsController],
  imports: [MetricsModule.register({/* ... */})],
  providers: [
    makeMetricProvider(Metrics.Counter, 'metrics_injector', {})
  ],
})
export class AppModule {}
```

Then, inject your new metric in the controller class like this:

```javascript
@Controller('/route')
export class MetricsController {
  constructor(@InjectMetric('metrics_injector') protected counter: Counter) {}

  @Get()
  public yourMetricMethod(): string {
    // ...
    this.counter.inc();
    // ...
  }
}
```

### Registering Metrics Controller

> The Metrics controller used currently by Prometheus only

```javascript
import { Module } from "@nestjs/common";
import { MetricsModule, MetricsController } from "@mists/nestjs-metrics";

@Module({
  controllers: [MetricsController],
  imports: [MetricsModule.register({
    prometheus: {
      route: '/metrics',
      // ...
    }
  })],
})
export class AppModule {}
```

### Metric Decorators

> Do not rely on decorators only since they have a very limited scope.

Decorators do not require providers, as they have their own mechanism of instantiation, based on the one that creates the providers. 

First step is to create a decorator using the default created wrappers:

```typescript
import { Controller, Get } from "@nestjs/common";
import { generateMetricDecorator, metricIncrementWrapper } from '@mists/nestjs-metrics';


const Increment = generateMetricDecorator(Metrics.Counter, 'metrics_counter_decorator', metricIncrementWrapper, genericOptions);
const GaugeIncrement = generateMetricDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  metricGaugeIncrementWrapper,
  genericOptions,
);
const GaugeDecrement = generateMetricDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  metricGaugeDecrementWrapper,
  genericOptions,
);
const Gauge = generateMetricDecorator(Metrics.Gauge, 'metrics_gauge_decorator', metricGaugeSetWrapper, genericOptions);
const GaugeTiming = generateMetricDecorator(Metrics.Gauge, 'metrics_gauge_decorator', metricTimingWrapper, genericOptions);
const HistogramObserve = generateMetricDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  metricObserveWrapper,
  genericOptions,
);
const HistogramTiming = generateMetricDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  metricTimingWrapper,
  genericOptions,
);
const SummaryObserve = generateMetricDecorator(Metrics.Summary, 'metrics_summary_decorator', metricObserveWrapper, genericOptions);
const SummaryTiming = generateMetricDecorator(Metrics.Summary, 'metrics_summary_decorator', metricTimingWrapper, genericOptions);


const IncrementHttpCalls = generateMetricDecorator(
  Metrics.Counter,
  'metric_http_calls',
  metricIncrementWrapper
);
```

Or by defining your own metric wrapper:

```typescript

export const customMetricWrapper: MetricWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as Gauge).inc(...metricArgs);
  return oldMethod.call(target, ...args);
};

const CustomIncrementHttpCalls = generateMetricDecorator(
  Metrics.Gauge,
  'metric_http_calls_custom',
  customMetricWrapper
);
```

Then apply the decorator on a controller method:

```typescript
@Controller('/test')
class CustomController {
  @Get()
  @IncrementHttpCalls()
  @CustomIncrementHttpCalls(1, { serverId: 'server_1' })
  testMethod() {}
}
```

## Authors

* [Dragos Cirjan](mailto:dragos.cirjan@gmail.com) - Initial work

## Issues / Support

Add a set of links to the [issues](/mists-aside/nestjs-metrics/issues) page/website, so people can know where to add issues/bugs or ask for support.

## License

(If the package is public, add licence)
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

<!-- ## Changelog

Small changelog history. The rest should be added to [CHANGELOG.md](CHANGELOG.md).

See here a template for changelogs: https://keepachangelog.com/en/1.0.0/

Also see this tool for automatically generating them: https://www.npmjs.com/package/changelog -->
