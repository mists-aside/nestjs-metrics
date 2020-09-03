/* eslint-disable @typescript-eslint/no-explicit-any */
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinonChai from 'sinon-chai';

import {Provider} from '@nestjs/common';

import {DummyStatsdClient} from '../src/statsd/dummy';
import {makeProvider} from '../src/statsd/provider';
import {mockerizeDummy} from './utils';
import {createGenericStatsdModule, createStatsdModule, StatsdGenericController, StatsdController} from './utils/statsd';

chai.use(sinonChai);
const expect = chai.expect;

mockerizeDummy(DummyStatsdClient);

describe('src/statsd', () => {
  describe('decorator', () => {
    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('injector', () => {
    it('custom injected (makeProvider("name", {custom config})) statsd will call .increment() method', async () => {
      const harness = await createGenericStatsdModule();
      const controller = harness.testingModule.get<StatsdGenericController>(StatsdGenericController);
      controller.testStatsdCustomInjector();

      expect(DummyStatsdClient.increment).to.have.been.calledWith('statsd.custom.injector', 10);
    });

    it('default injected statsd (makeProvider("name"), using Config) will call .increment() method', async () => {
      const harness = await createStatsdModule('dummy');
      const controller = harness.testingModule.get<StatsdController>(StatsdController);
      controller.testStatsdInjector();

      expect(DummyStatsdClient.increment).to.have.been.calledWith('statsd.injector', 10);
    });
  });

  describe('provider', () => {
    it('makeProvider will return a valid provider', () => {
      const provider = makeProvider('test', 'dummy');
      expect(provider).to.be.an('object');
      expect((provider as any).provide).to.be.a('string');
      expect((provider as any).useFactory).to.be.a('function');
    });

    it('makeProvider().useFactory() will return a valid instance of StatsdClient', () => {
      const provider = makeProvider('test', 'dummy');
      (provider as any).useFactory().increment('test');

      // can only test this way, since returned instance is a dummy
      expect(DummyStatsdClient.increment).to.have.been.called;
    });
  });

  // // let harness: TestHarness;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // before(() => {
  //   DummyStatsdClient.increment = sinon.fake();
  //   StatsdClient.prototype.increment = sinon.fake();
  // });

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // beforeEach(async () => {
  //   // harness =
  //   await createStatsModule({
  //     prometheus: {
  //       defaultMetrics: {
  //         enabled: true,
  //         config: {},
  //       },
  //       route: '/metrics',
  //     },
  //     statsd: {
  //       host: 'localhost',
  //     },
  //   });
  // });

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // afterEach(async () => {
  //   // MetadataLabels.getInstance().reset();
  // });

  // describe('when no options are given for *', () => {
  //   it('statsd, statsdClientProvider provider should offer a dummy object', async () => {
  //     await createStatsModule();
  //     const client = getStatsdClient();

  //     chai.expect(client).to.be.an('object');
  //     chai.expect(client).not.to.be.instanceOf(StatsdClient);
  //   });

  //   it("metric.increment() should call a dummy object's inc function", async () => {
  //     await createStatsModule();
  //     const client = getStatsdClient();
  //     client.increment('test');

  //     chai.expect(DummyStatsdClient.increment).to.have.been.called;
  //   });
  // });

  // describe('when options are given for *', () => {
  //   it('statsd, statsdClientProvider provider should offer a StatsdClient object', async () => {
  //     const client = getStatsdClient();

  //     chai.expect(client).to.be.an('object');
  //     chai.expect(client).to.be.instanceOf(StatsdClient);
  //   });

  //   it("metric.increment() should call a dummy object's inc function", async () => {
  //     const client = getStatsdClient();
  //     client.increment('test');

  //     chai.expect(client.increment).to.have.been.called;
  //   });
  // });
});
