import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {DummyCounter} from '../src/prometheus/utils';
import {Metrics} from '../src/enum';
import {getPrometheusMetric} from '../src/prometheus/utils';
import {createStatsModule} from './utils';

chai.use(sinonChai);

describe('src/prometheus', function () {
  // let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  before(() => {
    DummyCounter.inc = sinon.fake();
    PromClient.Counter.prototype.inc = sinon.fake();
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    // harness =
    await createStatsModule({
      prometheus: {
        defaultMetrics: {
          enabled: true,
          config: {},
        },
        route: '/metrics',
      },
    });
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    // MetadataLabels.getInstance().reset();
  });

  describe('when no options are given for *', () => {
    it('prometheus, getPrometheusMetric() should offer a dummy object', async () => {
      await createStatsModule();
      const metric = getPrometheusMetric(Metrics.Counter, {name: 'no_metric', help: 'no_metric'});

      chai.expect(metric).to.be.an('object');
      chai.expect(metric).not.to.be.instanceOf(PromClient.Counter);
    });

    it("metric.inc() should call a dummy object's inc function", async () => {
      await createStatsModule();
      const metric = getPrometheusMetric(Metrics.Counter, {name: 'no_metric', help: 'no_metric'});
      (metric as PromClient.Counter<string>).inc();

      chai.expect(DummyCounter.inc).to.have.been.called;
    });
  });

  describe('when options are given for *', () => {
    it('getPrometheusMetric(Metrics.Counter) should offer a Prometheus object', async () => {
      const metric = getPrometheusMetric(Metrics.Counter, {name: 'no_metric_counter', help: 'no_metric'});

      chai.expect(metric).to.be.an('object');
      chai.expect(metric).to.be.instanceOf(PromClient.Counter);
    });

    it("metric.inc() should call a dummy object's inc function", async () => {
      const metric = getPrometheusMetric(Metrics.Counter, {name: 'no_metric_counter', help: 'no_metric'});
      (metric as PromClient.Counter<string>).inc();

      chai.expect(DummyCounter.inc).to.have.been.called;
    });

    it('getPrometheusMetric(Metrics.Gauge) to generate a PromClient.Gauge object', async () => {
      const metric = getPrometheusMetric(Metrics.Gauge, {name: 'no_metric_gauge', help: 'no_metric'});
      chai.expect(metric).to.be.instanceOf(PromClient.Gauge);
    });

    it('getPrometheusMetric(Metrics.Histogram) to generate a PromClient.Histogram object', async () => {
      const metric = getPrometheusMetric(Metrics.Histogram, {name: 'no_metric_histogram', help: 'no_metric'});
      chai.expect(metric).to.be.instanceOf(PromClient.Histogram);
    });

    it('getPrometheusMetric(Metrics.Summary) to generate a PromClient.Summary object', async () => {
      const metric = getPrometheusMetric(Metrics.Summary, {name: 'no_metric_summary', help: 'no_metric'});
      chai.expect(metric).to.be.instanceOf(PromClient.Summary);
    });
  });
});
