import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as StatsdClient from 'statsd-client';

import {DummyStatsdClient, getStatsdClient} from '../src/statsd/utils';
import {createStatsModule, TestHarness} from './utils';

chai.use(sinonChai)

describe('src/statsd', function () {
  let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  before(() => {
    DummyStatsdClient.increment = sinon.fake()
    StatsdClient.prototype.increment = sinon.fake()
  })

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    harness = await createStatsModule({
      prometheus: {
        defaultMetrics: {
          enabled: true,
          config: {},
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
    // MetadataLabels.getInstance().reset();
  });

  describe('when no options are given for *', () => {
    it('statsd, statsdClientProvider provider should offer a dummy object', async () => {
      await createStatsModule();
      const client = getStatsdClient();

      chai.expect(client).to.be.an('object');
      chai.expect(client).not.to.be.instanceOf(StatsdClient);
    });

    it('metric.inc() should call a dummy object\'s inc function', async () => {
      await createStatsModule();
      const client = getStatsdClient();
      client.increment('test')

      chai.expect(DummyStatsdClient.increment).to.have.been.called;
    });
  });

  describe('when options are given for *', () => {
    it('statsd, statsdClientProvider provider should offer a StatsdClient object', async () => {
      const client = getStatsdClient();

      chai.expect(client).to.be.an('object');
      chai.expect(client).to.be.instanceOf(StatsdClient);
    });

    it('metric.inc() should call a dummy object\'s inc function', async () => {
      const client = getStatsdClient();
      client.increment('test')

      chai.expect(client.increment).to.have.been.called;
    });
  });
});
