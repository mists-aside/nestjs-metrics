import {Gauge} from './../src/metrics/gauge';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Metrics} from '../src/enum';
import {Counter} from '../src/metrics/counter';
import {Histogram} from '../src/metrics/histogram';
import {Summary} from '../src/metrics/summary';
import {getMetric} from '../src/metrics/utils';
import {DummyCounter, DummyGauge, DummyHistogram, DummySummary} from '../src/prometheus/utils';
import {DummyStatsdClient} from '../src/statsd/utils';
import {createStatsModule} from './utils';

chai.use(sinonChai);

describe('src/metrics', function () {
  // let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  before(() => {
    DummyStatsdClient.gaugeDelta = sinon.fake();
    DummyStatsdClient.gauge = sinon.fake();
    DummyStatsdClient.histogram = sinon.fake();
    DummyStatsdClient.increment = sinon.fake();
    DummyStatsdClient.timing = sinon.fake();

    DummyCounter.inc = sinon.fake();

    DummyGauge.inc = sinon.fake();
    DummyGauge.dec = sinon.fake();
    DummyGauge.set = sinon.fake();
    DummyGauge.startTimer = sinon.fake.returns(() => {
      return 0;
    });

    DummyHistogram.observe = sinon.fake();
    DummyHistogram.startTimer = sinon.fake.returns(() => {
      return 0;
    });

    DummySummary.observe = sinon.fake();
    DummySummary.startTimer = sinon.fake.returns(() => {
      return 0;
    });
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    // harness =
    await createStatsModule();
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    // MetadataLabels.getInstance().reset();
  });

  describe('Counter', () => {
    it("Counter.inc() should call a dummy object's inc function", async () => {
      const counter = getMetric(Metrics.Counter, 'counter_metric') as Counter;

      counter.inc();
      chai.expect(DummyStatsdClient.increment).to.have.been.called;
      chai.expect(DummyCounter.inc).to.have.been.called;
    });
  });

  describe('Gauge', () => {
    it("Gauge.inc() should call a dummy object's inc function", async () => {
      const gauge = getMetric(Metrics.Gauge, 'gauge_metric') as Gauge;

      gauge.inc();
      chai.expect(DummyStatsdClient.gaugeDelta).to.have.been.called;
      chai.expect(DummyGauge.inc).to.have.been.called;
    });

    it("Gauge.dec() should call a dummy object's dec function", async () => {
      const gauge = getMetric(Metrics.Gauge, 'gauge_metric') as Gauge;

      gauge.dec();
      chai.expect(DummyStatsdClient.gaugeDelta).to.have.been.called;
      chai.expect(DummyGauge.dec).to.have.been.called;
    });

    it("Gauge.set() should call a dummy object's set function", async () => {
      const gauge = getMetric(Metrics.Gauge, 'gauge_metric') as Gauge;

      gauge.set(10);
      chai.expect(DummyStatsdClient.gauge).to.have.been.called;
      chai.expect(DummyGauge.set).to.have.been.called;
    });

    it("Gauge.startTimer() should call a dummy object's startTimer & timing functions", async () => {
      const gauge = getMetric(Metrics.Gauge, 'gauge_metric') as Gauge;

      const end = gauge.startTimer();
      chai.expect(DummyGauge.startTimer).to.have.been.called;

      end();
      chai.expect(DummyStatsdClient.timing).to.have.been.called;
    });
  });

  describe('Histogram', () => {
    it("Histogram.observe() should call a dummy object's observe function", async () => {
      const histogram = getMetric(Metrics.Histogram, 'histogram_metric') as Histogram;

      histogram.observe(10);
      chai.expect(DummyStatsdClient.histogram).to.have.been.called;
      chai.expect(DummyHistogram.observe).to.have.been.called;
    });

    it("Histogram.startTimer() should call a dummy object's startTimer & timing functions", async () => {
      const histogram = getMetric(Metrics.Histogram, 'histogram_metric') as Histogram;

      const end = histogram.startTimer();
      chai.expect(DummyHistogram.startTimer).to.have.been.called;

      end();
      chai.expect(DummyStatsdClient.timing).to.have.been.called;
    });
  });

  describe('Summary', () => {
    it("Summary.observe() should call a dummy object's observe function", async () => {
      const summary = getMetric(Metrics.Summary, 'summary_metric') as Summary;

      summary.observe(10);
      chai.expect(DummyStatsdClient.histogram).to.have.been.called;
      chai.expect(DummySummary.observe).to.have.been.called;
    });

    it("Summary.startTimer() should call a dummy object's startTimer & timing functions", async () => {
      const summary = getMetric(Metrics.Summary, 'summary_metric') as Summary;

      const end = summary.startTimer();
      chai.expect(DummySummary.startTimer).to.have.been.called;

      end();
      chai.expect(DummyStatsdClient.timing).to.have.been.called;
    });
  });
});
