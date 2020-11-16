/* eslint-disable @typescript-eslint/no-explicit-any */

import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {DummyStatsdClient} from '../src/statsd/dummy';
import {makeStatsdProvider} from '../src/statsd/provider';
import {mockerizeDummy} from './utils';
import {TestHarness} from './utils/harness';
import {createTestModule} from './utils/module';
import {CustomInjectorController, StatsdController} from './utils/statsd';

chai.use(sinonChai);
const expect = chai.expect;

mockerizeDummy(DummyStatsdClient);

describe('src/statsd', () => {
  let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    if (harness) {
      PromClient.register.clear();
      await harness.app.close();
      harness = undefined;
    }
  });

  describe('decorator', () => {
    let controller: CustomInjectorController;

    // eslint-disable-next-line mocha/no-mocha-arrows
    before(async () => {
      harness = await createTestModule(
        {},
        {
          controllers: [CustomInjectorController],
          providers: [makeStatsdProvider('statsd_custom_injector', 'dummy')],
        },
      );
      controller = harness.testingModule.get<CustomInjectorController>(CustomInjectorController);
    });

    describe('increment', () => {
      it('using @Increment("test.increment.decorator") decorator should call statsd .increment() method', async () => {
        controller.testIncrementDecorator();

        expect(DummyStatsdClient.increment).to.have.been.calledWith('test.increment.decorator');
      });

      it('using @Increment("test.increment.decorator.custom.value", 10) decorator should call statsd .increment() method', async () => {
        controller.testIncrementDecoratorWithCustomValue();

        expect(DummyStatsdClient.increment).to.have.been.calledWith('test.increment.decorator.custom.value', 10);
      });

      it('using @Increment("test.increment.decorator.custom.value.and.tags", 10, {test: "test"}) decorator should call statsd .increment() method', async () => {
        controller.testIncrementDecoratorWithCustomValueAndTags();

        expect(DummyStatsdClient.increment).to.have.been.calledWith(
          'test.increment.decorator.custom.value.and.tags',
          10,
          {test: 'test'},
        );
      });
    });

    describe('gauge', () => {
      it('using @Gauge("test.gauge.decorator", 10) decorator should call statsd .gauge() method', async () => {
        controller.testGaugeDecorator();

        expect(DummyStatsdClient.gauge).to.have.been.calledWith('test.gauge.decorator', 10);
      });

      it('using @Gauge("test.gauge.decorator.with.tags", 10, {test: "test"}) decorator should call statsd .gauge() method', async () => {
        controller.testGaugeDecoratorWithTags();

        expect(DummyStatsdClient.gauge).to.have.been.calledWith('test.gauge.decorator.with.tags', 10, {test: 'test'});
      });

      it('using @GaugeDelta("test.gauge.delta.decorator", 10) decorator should call statsd .gauge() method', async () => {
        controller.testGaugeDeltaDecorator();

        expect(DummyStatsdClient.gaugeDelta).to.have.been.calledWith('test.gauge.delta.decorator', 10);
      });

      it('using @GaugeDelta("test.gauge.delta.decorator.with.tags", 10, {test: "test"}) decorator should call statsd .gauge() method', async () => {
        controller.testGaugeDeltaDecoratorWithTags();

        expect(DummyStatsdClient.gaugeDelta).to.have.been.calledWith('test.gauge.delta.decorator.with.tags', 10, {
          test: 'test',
        });
      });
    });

    describe('histogram', () => {
      it('using @Histogram("test.histogram.decorator", 10) decorator should call statsd .histogram() method', async () => {
        controller.testHistogramDecorator();

        expect(DummyStatsdClient.histogram).to.have.been.calledWith('test.histogram.decorator', 10);
      });

      it('using @Histogram("test.histogram.decorator.with.tags", 10, {test: "test"}) decorator should call statsd .histogram() method', async () => {
        controller.testHistogramDecoratorWithTags();

        expect(DummyStatsdClient.histogram).to.have.been.calledWith('test.histogram.decorator.with.tags', 10, {
          test: 'test',
        });
      });
    });

    describe('timing', () => {
      it('using @Timing("test.timing.decorator") decorator should call statsd .timing() method', async () => {
        controller.testTimingDecorator();

        expect(DummyStatsdClient.timing).to.have.been.calledWith('test.timing.decorator');
      });

      it('using @Timing("test.timing.decorator.with.tags", {test: "test"}) decorator should call statsd .timing() method', async () => {
        controller.testTimingDecoratorWithTags();

        expect(DummyStatsdClient.timing).to.have.been.calledWith('test.timing.decorator.with.tags', sinon.match.date, {
          test: 'test',
        });
      });

      it('using @Timing("test.timing.decorator") decorator on async method should call statsd .timing() method', async () => {
        await controller.testAsyncTimingDecorator();

        expect(DummyStatsdClient.timing).to.have.been.calledWith('test.timing.decorator', sinon.match.date);
      });

      it('using @Timing("test.timing.decorator.with.tags", {test: "test"}) decorator on async method should call statsd .timing() method', async () => {
        await controller.testAsyncTimingDecoratorWithTags();

        expect(DummyStatsdClient.timing).to.have.been.calledWith('test.timing.decorator.with.tags', sinon.match.date, {
          test: 'test',
        });
      });
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('injector', () => {
    it('custom injected (makeProvider("name", {custom config})) statsd will call .increment() method', async () => {
      if (harness) {
        await harness.app.close();
        PromClient.register.clear();
      }
      harness = await createTestModule(
        {},
        {
          controllers: [CustomInjectorController],
          providers: [makeStatsdProvider('statsd_custom_injector', 'dummy')],
        },
      );
      const controller = harness.testingModule.get<CustomInjectorController>(CustomInjectorController);
      controller.testStatsdCustomInjector();

      expect(DummyStatsdClient.increment).to.have.been.calledWith('statsd.custom.injector', 10);
    });

    it('default injected statsd (makeProvider("name"), using Config) will call .increment() method', async () => {
      if (harness) {
        await harness.app.close();
        PromClient.register.clear();
      }
      harness = await createTestModule(
        {
          statsd: 'dummy',
        },
        {
          controllers: [StatsdController],
          providers: [makeStatsdProvider('statsd_injector')],
        },
      );
      const controller = harness.testingModule.get<StatsdController>(StatsdController);
      controller.testStatsdInjector();

      expect(DummyStatsdClient.increment).to.have.been.calledWith('statsd.injector', 10);
    });
  });

  describe('provider', () => {
    it('makeProvider will return a valid provider', () => {
      const provider = makeStatsdProvider('test', 'dummy');
      expect(provider).to.be.an('object');
      expect((provider as any).provide).to.be.a('string');
      expect((provider as any).useFactory).to.be.a('function');
    });

    it('makeProvider().useFactory() will return a valid instance of StatsdClient', () => {
      const provider = makeStatsdProvider('test', 'dummy');
      (provider as any).useFactory().increment('test');

      // can only test this way, since returned instance is a dummy
      expect(DummyStatsdClient.increment).to.have.been.called;
    });
  });
});
