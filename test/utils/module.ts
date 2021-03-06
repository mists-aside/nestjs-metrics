import * as request from 'supertest';

import {Injectable} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {
  MetricsModuleAsyncOptions,
  MetricsController,
  MetricsModule,
  MetricsModuleOptions,
  MetricsModuleOptionsFactory,
} from '../../src';
import {TestHarness} from './harness';

export const createTestModule = async (
  options?: MetricsModuleOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testOptions?: {[key: string]: any[]},
): Promise<TestHarness> => {
  testOptions = testOptions || {};

  const testingModule = await Test.createTestingModule({
    controllers: [MetricsController, ...(testOptions.controllers || [])],
    imports: [MetricsModule.register(options || {}), ...(testOptions.imports || [])],
    providers: [...(testOptions.providers || [])],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
};

@Injectable()
export class StatsOptionsService implements MetricsModuleOptionsFactory {
  createStatsOptions(): MetricsModuleOptions {
    return {
      statsd: 'dummy',
      prometheus: {
        route: '/metrics',
        defaultMetrics: {
          enabled: true,
          config: {},
        },
      },
    };
  }
}

export const createAsyncTestModule = async (
  options?: MetricsModuleAsyncOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testOptions?: {[key: string]: any[]},
): Promise<TestHarness> => {
  testOptions = testOptions || {};

  const testingModule = await Test.createTestingModule({
    controllers: [MetricsController, ...(testOptions.controllers || [])],
    imports: [MetricsModule.registerAsync(options || {}), ...(testOptions.imports || [])],
    providers: [...(testOptions.providers || [])],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
};
