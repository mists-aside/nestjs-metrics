import * as request from 'supertest';

import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';

import {StatsModule, StatsOptions} from '../src';

export interface TestHarness {
  testingModule: TestingModule;
  app: INestApplication;
  agent: request.SuperTest<request.Test>;
}

export async function createStatsModule(options?: StatsOptions): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    imports: [StatsModule.register(options)],
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
