import { Counter, Gauge, Histogram, Summary } from './../src/adapter/dummy';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {TestHarness} from './utils/harness';
import {createTestModule, createAsyncTestModule, StatsOptionsService} from './utils/module';
import * as sinon from 'sinon';

const counter = new Counter();
counter.inc = sinon.fake();

const gauge = new Gauge();
gauge.inc = sinon.fake();
gauge.dec = sinon.fake();
gauge.set = sinon.fake();
gauge.startTimer = () => sinon.fake();

const histogram = new Histogram();
histogram.observe = sinon.fake();
histogram.reset = sinon.fake();
histogram.startTimer = sinon.fake();

const summary = new Histogram();
summary.observe = sinon.fake();
summary.reset = sinon.fake();
summary.startTimer = sinon.fake();

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/module', function () {
  // let harness: TestHarness;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // afterEach(async () => {
  //   if (harness) {
  //     await harness.app.close();
  //     harness = undefined;
  //   }
  // });

  // describe('StatsModule.register()', () => {
  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   beforeEach(async () => {
  //     harness = await createTestModule({
  //       adapters: {
  //         'counter': counter,
  //         'gauge': new Gauge(),
  //         'histogram': new Histogram(),
  //         'summary': new Summary(),
  //       },
  //     });
  //   });

  //   it('StatsModule to instantiate properly (without any options)', async () => {
  //     expect(true).to.equal(true);
  //   });

  //   it('StatsModule to instantiate properly (with options)', async () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('StatsModule.registerAsync()', () => {
  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   beforeEach(async () => {
  //     harness = await createAsyncTestModule({
  //       useClass: StatsOptionsService,
  //       inject: [StatsOptionsService],
  //     });
  //   });

  //   it('StatsModule to instantiate properly (without any options)', async () => {
  //     expect(true).to.equal(true);
  //   });

  //   it('StatsModule to instantiate properly (with options)', async () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
