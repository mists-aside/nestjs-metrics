import * as StatsdClient from 'statsd-client';
import * as request from 'supertest';

import {Controller} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {StatsModule} from '../../src/module';
import {InjectMetric, makeProvider} from '../../src/statsd';
import {StatsdOptions} from '../../src/statsd/options';
import {TestHarness} from './harness';

@Controller()
export class StatsdGenericController {
  constructor(@InjectMetric('statsd_custom_injector') protected statsd: StatsdClient) {}

  public testStatsdCustomInjector(): string {
    this.statsd.increment('statsd.custom.injector', 10);
    return 'statsd_custom_injector';
  }
}

export async function createGenericStatsdModule(): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    controllers: [StatsdGenericController],
    imports: [StatsModule.register({})],
    providers: [makeProvider('statsd_custom_injector', 'dummy')],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}

@Controller()
export class StatsdController {
  constructor(@InjectMetric('statsd_injector') protected statsd: StatsdClient) {}

  public testStatsdInjector(): string {
    this.statsd.increment('statsd.injector', 10);
    return 'statsd_injector';
  }
}

export async function createStatsdModule(options: StatsdOptions): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    controllers: [StatsdController],
    imports: [
      StatsModule.register({
        statsd: options,
      }),
    ],
    providers: [makeProvider('statsd_injector')],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}
