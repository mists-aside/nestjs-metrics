import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as StatsdClient from 'statsd-client';

import { MetadataLabels } from '../src/metadata';
import { getStatsdClient } from '../src/statsd/utils';
import { createStatsModule, TestHarness } from './utils';

describe('src/statsd', function () {
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
      statsd: {
        host: 'localhost',
      },
    });
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    MetadataLabels.getInstance().reset();
  });

  describe('when no options are given for *', () => {
    it('statsd, statsdClientProvider provider should offer a dummy object', async () => {
      await createStatsModule();
      const client = getStatsdClient();

      expect(client).to.be.an('object');
      expect(client).not.to.be.instanceOf(StatsdClient);
    });
  });

  describe('when options are given for *', () => {
    it('statsd, statsdClientProvider provider should offer a StatsdClient object', async () => {
      const client = getStatsdClient();

      expect(client).to.be.an('object');
      expect(client).to.be.instanceOf(StatsdClient);
    });
  });
});
