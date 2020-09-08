/* eslint-disable @typescript-eslint/no-explicit-any */
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Metrics} from '../src';
import {Config} from '../src/config';
import {makeMetricProvider} from '../src/metrics';
import {DummyCounter, DummyGauge, DummyHistogram, DummySummary} from '../src/prometheus/dummy';
import {DummyStatsdClient} from '../src/statsd/dummy';
import {mockerizeDummy} from './utils';
import {TestHarness} from './utils/harness';
// import { createTestModule, genericOptions, PrometheusController, testTags } from './utils/metrics';

chai.use(sinonChai);
const expect = chai.expect;

mockerizeDummy(DummyStatsdClient);
mockerizeDummy(DummyCounter);
mockerizeDummy(DummyGauge);
mockerizeDummy(DummyHistogram);
mockerizeDummy(DummySummary);
/* eslint-disable @typescript-eslint/no-empty-function */
DummyGauge.startTimer = sinon.fake.returns(() => {});
DummyHistogram.startTimer = sinon.fake.returns(() => {});
DummySummary.startTimer = sinon.fake.returns(() => {});
/* eslint-enable @typescript-eslint/no-empty-function */

describe('src/metrics', () => {
  // describe('decorator', () => {
  //   let harness: TestHarness;
  //   let controller: PrometheusController;

  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   before(async () => {
  //     harness = await createTestModule();
  //     controller = harness.testingModule.get<PrometheusController>(PrometheusController);
  //   });

  //   describe('counter', () => {
  //     it(`using @Increment(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Counter.inc() method`, async () => {
  //       controller.testIncrementDecorator();

  //       expect(DummyCounter.inc).to.have.been.calledWith(testTags);
  //     });

  //     it(`using @Increment(${JSON.stringify(
  //       testTags,
  //     )}, 10)) decorator should call metrics Counter.inc() method`, async () => {
  //       controller.testIncrementDecoratorWithValue();

  //       expect(DummyCounter.inc).to.have.been.calledWith(testTags, 10);
  //     });
  //   });

  //   describe('gauge', () => {
  //     it(`using @Gauge(${JSON.stringify(
  //       testTags,
  //     )}, 10) decorator should call metrics Gauge.set() method`, async () => {
  //       controller.testGaugeDecorator();

  //       expect(DummyGauge.set).to.have.been.calledWith(testTags, 10);
  //     });

  //     it(`using @GaugeIncrement(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Gauge.inc() method`, async () => {
  //       controller.testGaugeIncrementDecorator();

  //       expect(DummyGauge.inc).to.have.been.calledWith(testTags);
  //     });

  //     it(`using @GaugeIncrement(${JSON.stringify(
  //       testTags,
  //     )}, 10)) decorator should call metrics Gauge.inc() method`, async () => {
  //       controller.testGaugeIncrementDecoratorWithValue();

  //       expect(DummyGauge.inc).to.have.been.calledWith(testTags, 10);
  //     });
  //     it(`using @GaugeDecrement(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Gauge.dec() method`, async () => {
  //       controller.testGaugeDecrementDecorator();

  //       expect(DummyGauge.dec).to.have.been.calledWith(testTags);
  //     });

  //     it(`using @GaugeDecrement(${JSON.stringify(
  //       testTags,
  //     )}, 10)) decorator should call metrics Gauge.dec() method`, async () => {
  //       controller.testGaugeDecrementDecoratorWithValue();

  //       expect(DummyGauge.dec).to.have.been.calledWith(testTags, 10);
  //     });

  //     it(`using @GaugeTiming(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Gauge.startTimer() method`, async () => {
  //       controller.testGaugeTimingDecorator();

  //       expect(DummyGauge.startTimer).to.have.been.calledWith(testTags);
  //     });
  //   });

  //   describe('histogram', () => {
  //     it(`using @HistogramObserve(${JSON.stringify(
  //       testTags,
  //     )}, 10)) decorator should call metrics Histogram.observe() method`, async () => {
  //       controller.testHistogramObserveDecorator();

  //       expect(DummyHistogram.observe).to.have.been.calledWith(testTags, 10);
  //     });

  //     it(`using @HistogramTiming(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Histogram.startTimer() method`, async () => {
  //       controller.testHistogramTimingDecorator();

  //       expect(DummyHistogram.startTimer).to.have.been.calledWith(testTags);
  //     });
  //   });

  //   describe('summary', () => {
  //     it(`using @SummaryObserve(${JSON.stringify(
  //       testTags,
  //     )}, 10)) decorator should call metrics Summary.observe() method`, async () => {
  //       controller.testSummaryObserveDecorator();

  //       expect(DummySummary.observe).to.have.been.calledWith(testTags, 10);
  //     });

  //     it(`using @SummaryTiming(${JSON.stringify(
  //       testTags,
  //     )})) decorator should call metrics Summary.startTimer() method`, async () => {
  //       controller.testSummaryTimingDecorator();

  //       expect(DummySummary.startTimer).to.have.been.calledWith(testTags);
  //     });
  //   });
  // });

  // describe('injector', () => {
  //   it('custom injected (makeProvider(Metrics.Counter, {config})) metrics will call .inc() method', async () => {
  //     const harness = await createTestModule();
  //     const controller = harness.testingModule.get<PrometheusController>(PrometheusController);
  //     controller.testPrometheusCustomInjector();

  //     expect(DummyCounter.inc).to.have.been.called;
  //   });
  // });

  describe('provider', () => {
    it('makeProvider will return a valid provider', () => {
      const provider = makeMetricProvider(Metrics.Counter, 'metric_counter', {});
      expect(provider).to.be.an('object');
      expect((provider as any).provide).to.be.a('string');
      expect((provider as any).useFactory).to.be.a('function');
    });

    it('makeProvider().useFactory() will return a valid instance of Counter', () => {
      const provider = makeMetricProvider(Metrics.Counter, 'metric_counter', {});
      const metric = (provider as any).useFactory();
      metric.inc();

      // can only test this way, since returned instance is a dummy
      expect(DummyStatsdClient.increment).to.have.been.called;
      expect(DummyCounter.inc).to.have.been.called;
    });
  });

  // describe('utils', () => {
  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   beforeEach(async () => {
  //     await createTestModule({
  //       defaultMetrics: {
  //         enabled: true,
  //         config: {},
  //       },
  //       route: '/metrics',
  //     });
  //   });

  //   it('getMetric(Metrics.Counter, ...) to container PromClient.Counter<string>', () => {
  //     const metric = getMetric(Metrics.Counter, {
  //       help: 'metrics_counter',
  //       name: 'metrics_counter',
  //     });
  //     expect(metric).to.be.an('object');
  //     expect((metric as PromClient.Counter<string>).inc).to.be.a('function');
  //   });

  //   it('getMetric(Metrics.Gauge, ...) to container PromClient.Gauge<string>', () => {
  //     const metric = getMetric(Metrics.Gauge, {
  //       help: 'metrics_gauge',
  //       name: 'metrics_gauge',
  //     });
  //     expect(metric).to.be.an('object');
  //     expect((metric as PromClient.Gauge<string>).inc).to.be.a('function');
  //     expect((metric as PromClient.Gauge<string>).dec).to.be.a('function');
  //   });

  //   it('getMetric(Metrics.Histogram, ...) to container PromClient.Histogram<string>', () => {
  //     const metric = getMetric(Metrics.Histogram, {
  //       help: 'metrics_histogram',
  //       name: 'metrics_histogram',
  //     });
  //     expect(metric).to.be.an('object');
  //     expect((metric as PromClient.Histogram<string>).observe).to.be.a('function');
  //     expect((metric as PromClient.Histogram<string>).startTimer).to.be.a('function');
  //   });

  //   it('getMetric(Metrics.Summary, ...) to container PromClient.Summary<string>', () => {
  //     const metric = getMetric(Metrics.Summary, {
  //       help: 'metrics_summary',
  //       name: 'metrics_summary',
  //     });
  //     expect(metric).to.be.an('object');
  //     expect((metric as PromClient.Summary<string>).observe).to.be.a('function');
  //     expect((metric as PromClient.Summary<string>).startTimer).to.be.a('function');
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
