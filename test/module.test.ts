import {expect} from 'chai';
import {describe, it} from 'mocha';
import {TestHarness} from './utils/harness';
import {createTestModule, createAsyncTestModule, StatsOptionsService} from './utils/module';
import {TestingModule} from '@nestjs/testing';
import * as PromClient from 'prom-client';

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/module', function () {
  let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    if (harness) {
      PromClient.register.clear();
      await harness.app.close();
      harness = undefined;
    }
  });

  describe('StatsModule.register()', () => {
    // eslint-disable-next-line mocha/no-mocha-arrows
    beforeEach(async () => {
      harness = await createTestModule({
        statsd: 'dummy',
        prometheus: {
          route: '/metrics',
          defaultMetrics: {
            enabled: true,
            config: {},
          },
        },
      });
    });

    it('StatsModule to instantiate properly (without any options)', async () => {
      if (harness) {
        await harness.app.close();
        PromClient.register.clear();
      }
      harness = await createTestModule();
      expect(harness.testingModule).to.be.an('object');
      expect(harness.testingModule).to.be.instanceOf(TestingModule);
    });

    it('StatsModule to instantiate properly (with options)', async () => {
      expect(harness.testingModule).to.be.an('object');
      expect(harness.testingModule).to.be.instanceOf(TestingModule);
    });

    it('registers a /metrics endpoint', async () => {
      const response = await harness.agent.get('/metrics');

      expect(response).to.have.property('status').to.eql(200);
    });

    it('collects default metrics', async () => {
      const response = await harness.agent.get('/metrics');

      expect(response).to.have.property('text').to.contain('process_cpu_user_seconds_total');
    });
  });

  describe('StatsModule.registerAsync()', () => {
    // eslint-disable-next-line mocha/no-mocha-arrows
    beforeEach(async () => {
      harness = await createAsyncTestModule({
        useClass: StatsOptionsService,
        inject: [StatsOptionsService],
      });
    });

    it('StatsModule to instantiate properly (without any options)', async () => {
      if (harness) {
        await harness.app.close();
        PromClient.register.clear();
      }
      harness = await createTestModule();
      expect(harness.testingModule).to.be.an('object');
      expect(harness.testingModule).to.be.instanceOf(TestingModule);
    });

    it('StatsModule to instantiate properly (with options)', async () => {
      expect(harness.testingModule).to.be.an('object');
      expect(harness.testingModule).to.be.instanceOf(TestingModule);
    });

    it('registers a /metrics endpoint', async () => {
      const response = await harness.agent.get('/metrics');

      expect(response).to.have.property('status').to.eql(200);
    });

    it('collects default metrics', async () => {
      const response = await harness.agent.get('/metrics');

      expect(response).to.have.property('text').to.contain('process_cpu_user_seconds_total');
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
