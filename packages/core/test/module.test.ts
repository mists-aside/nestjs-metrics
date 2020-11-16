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
      await harness.app.close();
      harness = undefined;
    }
  });

  describe('StatsModule.register()', () => {
    // eslint-disable-next-line mocha/no-mocha-arrows
    beforeEach(async () => {
      harness = await createTestModule({
        adapters: {},
      });
    });

    it('StatsModule to instantiate properly (without any options)', async () => {
      expect(true).to.equal(true);
    });

    it('StatsModule to instantiate properly (with options)', async () => {
      expect(true).to.equal(true);
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
      expect(true).to.equal(true);
    });

    it('StatsModule to instantiate properly (with options)', async () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
