import * as sinon from 'sinon';

// import * as request from 'supertest';

// import {INestApplication} from '@nestjs/common';
// import {Test, TestingModule} from '@nestjs/testing';

// import {StatsModule, StatsOptions} from '../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockerizeDummy = (entity: object): {[key: string]: any} => {
  const oldEntity = {
    ...entity,
  };
  Object.getOwnPropertyNames(entity).forEach((item) => {
    entity[item] = sinon.fake();
  });
  return oldEntity;
};

// export interface TestHarness {
//   testingModule: TestingModule;
//   app: INestApplication;
//   agent: request.SuperTest<request.Test>;
// }

// export async function createStatsModule(options?: StatsOptions): Promise<TestHarness> {
//   const testingModule = await Test.createTestingModule({
//     imports: [StatsModule.register(options)],
//     providers: [],
//   }).compile();

//   const app = testingModule.createNestApplication();
//   await app.init();

//   const agent = request(app.getHttpServer());

//   return {
//     testingModule,
//     app,
//     agent,
//   };
// }
