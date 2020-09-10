import * as request from 'supertest';

import {Test} from '@nestjs/testing';

import {StatsModule} from '../../src';
import {StatsOptions} from '../../src/config';
import {TestHarness} from './harness';

export async function createTestModule(
  options?: StatsOptions,
  testOptions?: {[key: string]: any[]},
): Promise<TestHarness> {
  testOptions = testOptions || {};

  const testingModule = await Test.createTestingModule({
    controllers: [...(testOptions.controllers || [])],
    imports: [StatsModule.register(options || {}), ...(testOptions.imports || [])],
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
}
