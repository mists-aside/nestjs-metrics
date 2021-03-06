import {Injectable, Module} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';

import {
  MetricsModule,
  MetricsModuleAsyncOptions,
  MetricsModuleOptions,
  MetricsModuleOptionsFactory,
} from '../../src/module';
import {CounterPrometheus} from './adapters';
import {TestHarness} from './harness';

export const createTestModule = async (
  options?: MetricsModuleOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testOptions?: {[key: string]: any[]},
): Promise<TestHarness> => {
  testOptions = testOptions || {};

  const testingModule = await Test.createTestingModule({
    controllers: [...(testOptions.controllers || [])],
    imports: [MetricsModule.register(options), ...(testOptions.imports || [])],
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
export class MetricsModuleOptionsService implements MetricsModuleOptionsFactory {
  createMetricsModuleOptions(): MetricsModuleOptions {
    return {
      adapters: [
        {
          metric: 'counter',
          adapter: new CounterPrometheus(),
        },
      ],
    };
  }
}

@Module({
  providers: [MetricsModuleOptionsService],
  exports: [MetricsModuleOptionsService],
})
export class MetricsOptionsModule {}

export const createAsyncTestModule = async (
  options?: MetricsModuleAsyncOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testOptions?: {[key: string]: any[]},
): Promise<TestHarness> => {
  testOptions = testOptions || {};

  const testingModule = await Test.createTestingModule({
    controllers: [...(testOptions.controllers || [])],
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
