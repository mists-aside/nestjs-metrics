import {expect} from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';

import {Metrics} from '../src/metrics';
import {getPrometheusMetric} from '../src/prometheus/utils';
import {createStatsModule, TestHarness} from './utils';

describe('src/prometheus', function () {
  let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    harness = await createStatsModule({
      prometheus: {
        defaultMetrics: {
          enabled: true,
          config: {}
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

      expect(metric).to.be.an('object');
      expect(metric).not.to.be.instanceOf(PromClient.Counter);
    });
  });

  describe('when options are given for *', () => {
    it('prometheus, getPrometheusMetric() should offer a Prometheus object', async () => {
      const metric = getPrometheusMetric(Metrics.Counter, {name: 'no_metric', help: 'no_metric'});

      expect(metric).to.be.an('object');
      expect(metric).to.be.instanceOf(PromClient.Counter);
    });
  });
});
