import {INestApplication} from '@nestjs/common';
import {TestingModule} from '@nestjs/testing';
import * as request from 'supertest';

export interface TestHarness {
  testingModule: TestingModule;
  app: INestApplication;
  agent: request.SuperTest<request.Test>;
}
