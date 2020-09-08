/* eslint-disable @typescript-eslint/no-explicit-any */

import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Metrics} from '../src';
import {Config} from '../src/config';
import {makeProvider} from '../src/prometheus';
import {DummyCounter, DummyGauge, DummyHistogram, DummySummary} from '../src/prometheus/dummy';
import {getPrometheusMetric} from '../src/prometheus/utils';
import {mockerizeDummy} from './utils';
import {TestHarness} from './utils/harness';
import {createTestModule, genericOptions, PrometheusController, testTags} from './utils/prometheus';

chai.use(sinonChai);
const expect = chai.expect;

mockerizeDummy(DummyCounter);
mockerizeDummy(DummyGauge);
mockerizeDummy(DummyHistogram);
mockerizeDummy(DummySummary);
/* eslint-disable @typescript-eslint/no-empty-function */
DummyGauge.startTimer = sinon.fake.returns(() => {});
DummyHistogram.startTimer = sinon.fake.returns(() => {});
DummySummary.startTimer = sinon.fake.returns(() => {});
/* eslint-enable @typescript-eslint/no-empty-function */

describe('src/prometheus', () => {
  describe('decorator', () => {
    let harness: TestHarness;
    let controller: PrometheusController;

    // eslint-disable-next-line mocha/no-mocha-arrows
    before(async () => {
      harness = await createTestModule();
      controller = harness.testingModule.get<PrometheusController>(PrometheusController);
    });

    describe('counter', () => {
      it(`using @Increment(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Counter.inc() method`, async () => {
        controller.testIncrementDecorator();

        expect(DummyCounter.inc).to.have.been.calledWith(testTags);
      });

      it(`using @Increment(${JSON.stringify(
        testTags,
      )}, 10)) decorator should call prometheus Counter.inc() method`, async () => {
        controller.testIncrementDecoratorWithValue();

        expect(DummyCounter.inc).to.have.been.calledWith(testTags, 10);
      });
    });

    describe('gauge', () => {
      it(`using @Gauge(${JSON.stringify(
        testTags,
      )}, 10) decorator should call prometheus Gauge.set() method`, async () => {
        controller.testGaugeDecorator();

        expect(DummyGauge.set).to.have.been.calledWith(testTags, 10);
      });

      it(`using @GaugeIncrement(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Gauge.inc() method`, async () => {
        controller.testGaugeIncrementDecorator();

        expect(DummyGauge.inc).to.have.been.calledWith(testTags);
      });

      it(`using @GaugeIncrement(${JSON.stringify(
        testTags,
      )}, 10)) decorator should call prometheus Gauge.inc() method`, async () => {
        controller.testGaugeIncrementDecoratorWithValue();

        expect(DummyGauge.inc).to.have.been.calledWith(testTags, 10);
      });
      it(`using @GaugeDecrement(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Gauge.dec() method`, async () => {
        controller.testGaugeDecrementDecorator();

        expect(DummyGauge.dec).to.have.been.calledWith(testTags);
      });

      it(`using @GaugeDecrement(${JSON.stringify(
        testTags,
      )}, 10)) decorator should call prometheus Gauge.dec() method`, async () => {
        controller.testGaugeDecrementDecoratorWithValue();

        expect(DummyGauge.dec).to.have.been.calledWith(testTags, 10);
      });

      it(`using @GaugeTiming(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Gauge.startTimer() method`, async () => {
        controller.testGaugeTimingDecorator();

        expect(DummyGauge.startTimer).to.have.been.calledWith(testTags);
      });
    });

    describe('histogram', () => {
      it(`using @HistogramObserve(${JSON.stringify(
        testTags,
      )}, 10)) decorator should call prometheus Histogram.observe() method`, async () => {
        controller.testHistogramObserveDecorator();

        expect(DummyHistogram.observe).to.have.been.calledWith(testTags, 10);
      });

      it(`using @HistogramTiming(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Histogram.startTimer() method`, async () => {
        controller.testHistogramTimingDecorator();

        expect(DummyHistogram.startTimer).to.have.been.calledWith(testTags);
      });
    });

    describe('summary', () => {
      it(`using @SummaryObserve(${JSON.stringify(
        testTags,
      )}, 10)) decorator should call prometheus Summary.observe() method`, async () => {
        controller.testSummaryObserveDecorator();

        expect(DummySummary.observe).to.have.been.calledWith(testTags, 10);
      });

      it(`using @SummaryTiming(${JSON.stringify(
        testTags,
      )})) decorator should call prometheus Summary.startTimer() method`, async () => {
        controller.testSummaryTimingDecorator();

        expect(DummySummary.startTimer).to.have.been.calledWith(testTags);
      });
    });
  });

  describe('injector', () => {
    it('custom injected (makeProvider(Metrics.Counter, {config})) prometheus will call .inc() method', async () => {
      const harness = await createTestModule();
      const controller = harness.testingModule.get<PrometheusController>(PrometheusController);
      controller.testPrometheusCustomInjector();

      expect(DummyCounter.inc).to.have.been.called;
    });
  });

  describe('provider', () => {
    it('makeProvider will return a valid provider', () => {
      const provider = makeProvider(Metrics.Counter, genericOptions);
      expect(provider).to.be.an('object');
      expect((provider as any).provide).to.be.a('string');
      expect((provider as any).useFactory).to.be.a('function');
    });

    it('makeProvider().useFactory() will return a valid instance of PrometheusClient', () => {
      const provider = makeProvider(Metrics.Counter, genericOptions);
      (provider as any).useFactory().inc();

      // can only test this way, since returned instance is a dummy
      expect(DummyCounter.inc).to.have.been.called;
    });
  });

  describe('utils', () => {
    // eslint-disable-next-line mocha/no-mocha-arrows
    beforeEach(async () => {
      await createTestModule({
        defaultMetrics: {
          enabled: true,
          config: {},
        },
        route: '/metrics',
      });
    });

    it('getMetric(Metrics.Counter, ...) to container PromClient.Counter<string>', () => {
      const metric = getPrometheusMetric(Metrics.Counter, {
        help: 'prometheus_counter',
        name: 'prometheus_counter',
      });
      expect(metric).to.be.an('object');
      expect((metric as PromClient.Counter<string>).inc).to.be.a('function');
    });

    it('getMetric(Metrics.Gauge, ...) to container PromClient.Gauge<string>', () => {
      const metric = getPrometheusMetric(Metrics.Gauge, {
        help: 'prometheus_gauge',
        name: 'prometheus_gauge',
      });
      expect(metric).to.be.an('object');
      expect((metric as PromClient.Gauge<string>).inc).to.be.a('function');
      expect((metric as PromClient.Gauge<string>).dec).to.be.a('function');
    });

    it('getMetric(Metrics.Histogram, ...) to container PromClient.Histogram<string>', () => {
      const metric = getPrometheusMetric(Metrics.Histogram, {
        help: 'prometheus_histogram',
        name: 'prometheus_histogram',
      });
      expect(metric).to.be.an('object');
      expect((metric as PromClient.Histogram<string>).observe).to.be.a('function');
      expect((metric as PromClient.Histogram<string>).startTimer).to.be.a('function');
    });

    it('getMetric(Metrics.Summary, ...) to container PromClient.Summary<string>', () => {
      const metric = getPrometheusMetric(Metrics.Summary, {
        help: 'prometheus_summary',
        name: 'prometheus_summary',
      });
      expect(metric).to.be.an('object');
      expect((metric as PromClient.Summary<string>).observe).to.be.a('function');
      expect((metric as PromClient.Summary<string>).startTimer).to.be.a('function');
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
