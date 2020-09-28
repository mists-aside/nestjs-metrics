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

> *Any fool can write code that a computer can understand. Good programmers write code that humans can understand.* – Martin Fowler

<!-- TOC -->

- [NestJs Metrics Module](#nestjs-metrics-module)
  - [Getting Started](#getting-started)
    - [Prerequisites / Dependencies](#prerequisites--dependencies)
    - [Installation](#installation)
      - [Documentation](#documentation)
        - [Registering Module](#registering-module)
        - [Registering Metrics](#registering-metrics)
        - [Registering Metrics Controller](#registering-metrics-controller)
        - [Metrics Decorators](#metrics-decorators)
      - [API Documentation](#api-documentation)
    - [Development](#development)
      - [Requirements](#requirements)
    - [Testing](#testing)
      - [Single Tests](#single-tests)
    - [Deployment](#deployment)
  - [Authors](#authors)
  - [Issues / Support](#issues--support)
  - [License](#license)
- [Project Title](#project-title)
  - [Getting Started](#getting-started-1)
    - [Prereqiusites / Dependencies](#prereqiusites--dependencies)
      - [For Windows](#for-windows)
      - [For Linux](#for-linux)
      - [Known Issues / Troubleshooting](#known-issues--troubleshooting)
    - [Installation](#installation-1)
      - [Say what the step will be](#say-what-the-step-will-be)
      - [And repeat](#and-repeat)
    - [Development](#development-1)
    - [Testing](#testing-1)
      - [Break down into (at least) unit tests](#break-down-into-at-least-unit-tests)
      - [and end to end tests](#and-end-to-end-tests)
      - [And coding style tests](#and-coding-style-tests)
    - [Deployment](#deployment-1)
  - [Authors](#authors-1)
  - [Issues / Support](#issues--support-1)
  - [License](#license-1)
  - [Changelog](#changelog)

<!-- /TOC -->

## Getting Started

### Prerequisites / Dependencies

Depends on the following modules:

* [node-statsd-client](https://github.com/msiebuhr/node-statsd-client) (with the additonal `@types/node-statsd-client` for TypeScript)
* [prom-client](https://github.com/siimon/prom-client)

### Installation

```bash
npm install -S @mists/nestjs-metrics
# yarn add --dev @mists/nestjs-metrics
```

#### Documentation

##### Registering Module

**Using (sync) `register()` method**:

```javascript
@Module({
  imports: [MetricsModule.register({
    prometheus: {
      // ...
    },
    statsd: {
      // ...
    }
  })],
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
      // see the MetricsModule::register() options
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

##### Registering Metrics

There are currently

* `Counter` used for counting events; reflected by:
  * [`PromClient.Counter`](https://github.com/siimon/prom-client#counter)
  * [`StatsdClient.increment`](https://github.com/msiebuhr/node-statsd-client#counting-stuff)
* `Gauge` used for counting events (with the possibility of decreasing or resetting a value as well) and for timing them; reflected by
  * [`PromClient.Gauge`](https://github.com/siimon/prom-client#gauge)
  * [`StatsdClient.gauge` and `StatsdClient.gaugeDelta`](https://github.com/msiebuhr/node-statsd-client#gauges) and [`StatsdClient.timing`](https://github.com/msiebuhr/node-statsd-client#delays)
* `Histogram` similar to Gauge, but used for tracking sized and frequency of events; reflected by 
  * [`PromClient.Histogram`](https://github.com/siimon/prom-client#histogram)
  * [`StatsdClient.histogram`](https://github.com/msiebuhr/node-statsd-client#histogram) (and adding [`StatsdClient.timing`](https://github.com/msiebuhr/node-statsd-client#delays) for complete support)
* `Summary` similar to Histogram, but used to calculate percentiles of observed values; reflected by
  * [`PromClient.Summary`](https://github.com/siimon/prom-client#summary)
  * on the side of `statsd`, to support compatibility (not sure if it's good or bad, yet), the same methods as for `Histogram`

You will need to create a provider first,

```javascript
import { Module } from "@nestjs/common";
import { MetricsModule, MetricsController, Counter,  } from "@mists/nestjs-metrics";

@Module({
  controllers: [MetricsController],
  imports: [MetricsModule.register({/* ... */})],
  providers: [makeMetricProvider(Metrics.Counter, 'metrics_injector', {})],
})
export class AppModule {}
```

then, inject your new counter in the controller class:

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

##### Registering Metrics Controller

> used currently by Prometheus only

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

##### Metrics Decorators


#### API Documentation

See [API documentation here](https://mists-aside.github.io/nestjs-metrics).

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

> Remove Everything above this line

<hr />














# Project Title

<!-- Set of shield/badges explaining where to find more information about the project (i.e. Where to look for unit test reports, where to see code coverage and code scans, etc.). You can find a lot of them on https://shields.io/) -->

<!-- CI Badges -->
<!-- [![TravisCI](https://travis-ci.org/templ-project/generic.svg?branch=master)](https://travis-ci.org/templ-project/generic) -->
<!-- [![CircleCI](https://circleci.com/gh/templ-project/generic.svg?style=shield)](https://circleci.com/gh/templ-project/generic) -->

<!-- Sonar Badges -->
<!-- [![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=templ-project_generic&metric=alert_status)](https://sonarcloud.io/dashboard?id=templ-project_generic)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=templ-project_generic&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=templ-project_generic)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=templ-project_generic&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=templ-project_generic)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=templ-project_generic&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=templ-project_generic) -->

<!-- Donation Badges -->
<!-- [![Donate to this project using Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://patreon.com/dragoscirjan)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UMMN8JPLVAUR4&source=url)
[![Donate to this project using Flattr](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/balupton)
[![Donate to this project using Liberapay](https://img.shields.io/badge/liberapay-donate-yellow.svg)](https://liberapay.com/dragoscirjan)
[![Donate to this project using Thanks App](https://img.shields.io/badge/thanksapp-donate-yellow.svg)](https://givethanks.app/donate/npm/badges)
[![Donate to this project using Boost Lab](https://img.shields.io/badge/boostlab-donate-yellow.svg)](https://boost-lab.app/dragoscirjan/badges)
[![Donate to this project using Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg)](https://buymeacoffee.com/balupton)
[![Donate to this project using Open Collective](https://img.shields.io/badge/open%20collective-donate-yellow.svg)](https://opencollective.com/dragoscirjan)
[![Donate to this project using Cryptocurrency](https://img.shields.io/badge/crypto-donate-yellow.svg)](https://dragoscirjan.me/crypto)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://dragoscirjan.me/paypal)
[![Buy an item on our wishlist for us](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://dragoscirjan.me/wishlist)
-->

One Paragraph of project description goes here

<!--
Insert Table of Contents Here
This can be done using [AlanWalk.markdown-toc](https://marketplace.visualstudio.com/items?itemName=AlanWalk.markdown-toc) plugin, 
which is also included in 
[itmcdev.generic-extension-pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.generic-extension-pack) extension pack.
-->

## Getting Started

### Prereqiusites / Dependencies

What things you need to install the software and how to install them (based on each OS type). 

#### For Windows
```bash
# Give Examples

npm install -g node-gyp windows-build-tools
# Warning: Please note windows-build-tools will install MSVS which takes a 
# LONG amount of time.
```

#### For Linux

```bash
# Give Examples

apt-get install build-essential mono
npm install -y node-gyp
```

#### Known Issues / Troubleshooting

Describe a list of known issues, and how to bypass them.

### Installation

A step by step series of examples that tell you how to get a development env running


#### Say what the step will be

```
Give the example
```

#### And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

### Development

Explain any development process for the project, if necesary

```
give examples
```

### Testing


Explain how to run the automated tests for this system

#### Break down into (at least) unit tests
Explain what these tests test and why

```
Give an example
```

#### and end to end tests
Explain what these tests test and why

```
Give an example
```

#### And coding style tests

Explain what these tests test and why

```
Give an example
```

### Deployment

Add additional notes about how to deploy this on a live system

## Authors
* [Dragos Cirjan](mailto:dragos.cirjan@gmail.com) - Initial work - [PurpleBooth](#link-to-change)

See also the list of contributors who participated in this project.

## Issues / Support

Add a set of links to the [issues](/templ-project/generic/issues) page/website, so people can know where to add issues/bugs or ask for support.

## License

(If the package is public, add licence)
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Changelog

Small changelog history. The rest should be added to [CHANGELOG.md](CHANGELOG.md).

See here a template for changelogs: https://keepachangelog.com/en/1.0.0/

Also see this tool for automatically generating them: https://www.npmjs.com/package/changelog
