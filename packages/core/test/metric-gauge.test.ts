/* eslint-disable mocha/no-mocha-arrows */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {GaugeMetric} from '../src';
import {Config} from '../src/config';
import {GaugeMetricController} from '../src/test';
import {GaugePrometheus, GaugeStatsd, TestHarness, createTestModule} from './utils';
import {endTimer} from './utils/adapters';

chai.use(sinonChai);
const expect = chai.expect;

const metricName = nanoid();

const gaugePrometheus = new GaugePrometheus();
const gaugeStatsd = new GaugeStatsd();

const metricAdapters = [
  {
    adapter: gaugePrometheus,
    metric: metricName,
  },
  {
    adapter: gaugeStatsd,
    metric: metricName,
  },
];

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  before(() => {
    Config.getInstance().clear();
    Config.getInstance().addAdapters(metricAdapters);
  });

  describe('Controller(Metric::GaugeMetric)', () => {
    let harness: TestHarness;
    let controller: GaugeMetricController;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.spy(gaugePrometheus, 'dec');
      sandbox.spy(gaugePrometheus, 'inc');
      sandbox.spy(gaugePrometheus, 'set');
      sandbox.spy(gaugePrometheus, 'startTimer');
      sandbox.spy(gaugePrometheus, 'reset');
      sandbox.spy(gaugeStatsd, 'dec');
      sandbox.spy(gaugeStatsd, 'inc');
      sandbox.spy(gaugeStatsd, 'set');
      sandbox.spy(gaugeStatsd, 'startTimer');
      sandbox.spy(gaugeStatsd, 'reset');

      harness = await createTestModule(
        {
          adapters: [],
        },
        {
          controllers: [GaugeMetricController],
          providers: [GaugeMetric.getProvider()],
        },
      );

      controller = harness.app.get<GaugeMetricController>(GaugeMetricController);
    });

    afterEach(async () => {
      await harness.app.close();

      harness = undefined;
      controller = undefined;

      sandbox.restore();
      sandbox = undefined;
    });

    // dec

    describe('dec()', () => {
      it('GaugeMetricController.decAllAdapters() should trigger dec() function on all gauge adapters', () => {
        controller.decAllAdapters();
        expect(gaugePrometheus.dec).to.have.been.called;
        expect(gaugeStatsd.dec).to.have.been.called;
      });

      it(`GaugeMetricController.decByAdapter('prometheus') should trigger dec() function on all 'prometheus' gauge adapters`, () => {
        controller.decByAdapter('prometheus');
        expect(gaugePrometheus.dec).to.have.been.called;
        expect(gaugeStatsd.dec).to.not.have.been.called;
      });

      it(`GaugeMetricController.decByMetricName('${metricName}') should trigger dec() function on all gauge adapters`, () => {
        controller.decByMetricName(metricName);
        expect(gaugePrometheus.dec).to.have.been.called;
        expect(gaugeStatsd.dec).to.have.been.called;
      });

      it('GaugeMetricController.decWithDelta() should trigger dec() function using {delta: 2}', () => {
        controller.decWithDelta();
        expect(gaugePrometheus.dec).to.have.been.calledWith({delta: 2, tags: undefined});
      });

      it('GaugeMetricController.decWithDeltaAndTags() should trigger dec() function using {tag: `gauge`}', () => {
        controller.decWithDeltaAndTags();
        expect(gaugePrometheus.dec).to.have.been.calledWith({delta: 2, tags: {tag: 'gauge'}});
      });

      it('GaugeMetricController.decWithDecorator() should trigger dec() function using a decorator', async () => {
        await controller.decWithDecorator();

        expect(gaugePrometheus.dec).to.have.been.called;
        expect(gaugeStatsd.dec).to.not.have.been.called;
      });
    });

    // inc

    describe('inc()', () => {
      it('GaugeMetricController.incAllAdapters() should trigger inc() function on all gauge adapters', () => {
        controller.incAllAdapters();
        expect(gaugePrometheus.inc).to.have.been.called;
        expect(gaugeStatsd.inc).to.have.been.called;
      });

      it(`GaugeMetricController.incByAdapter('prometheus') should trigger inc() function on all 'prometheus' gauge adapters`, () => {
        controller.incByAdapter('prometheus');
        expect(gaugePrometheus.inc).to.have.been.called;
        expect(gaugeStatsd.inc).to.not.have.been.called;
      });

      it(`GaugeMetricController.incByMetricName('${metricName}') should trigger inc() function on all gauge adapters`, () => {
        controller.incByMetricName(metricName);
        expect(gaugePrometheus.inc).to.have.been.called;
        expect(gaugeStatsd.inc).to.have.been.called;
      });

      it('GaugeMetricController.incWithDelta() should trigger inc() function using {delta: 2}', () => {
        controller.incWithDelta();
        expect(gaugePrometheus.inc).to.have.been.calledWith({delta: 2, tags: undefined});
      });

      it('GaugeMetricController.incWithDeltaAndTags() should trigger inc() function using {tag: `gauge`}', () => {
        controller.incWithDeltaAndTags();
        expect(gaugePrometheus.inc).to.have.been.calledWith({delta: 2, tags: {tag: 'gauge'}});
      });

      it('GaugeMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
        await controller.incWithDecorator();

        expect(gaugePrometheus.inc).to.have.been.called;
        expect(gaugeStatsd.inc).to.not.have.been.called;
      });
    });

    // set

    describe('set()', () => {
      it('GaugeMetricController.setAllAdapters() should trigger set() function on all gauge adapters', () => {
        controller.setAllAdapters();
        expect(gaugePrometheus.set).to.have.been.called;
        expect(gaugeStatsd.set).to.have.been.called;
      });

      it('GaugeMetricController.setByAdapter() should trigger set() function on all `prometheus` gauge adapters', () => {
        controller.setByAdapter('prometheus');
        expect(gaugePrometheus.set).to.have.been.calledWith({delta: 1, tags: undefined});
        expect(gaugeStatsd.set).to.not.have.been.called;
      });

      it('GaugeMetricController.setByMetric() should trigger set() function on all `gauge` gauge adapters', () => {
        controller.setByMetric(metricName);
        expect(gaugePrometheus.set).to.have.been.calledWith({delta: 1, tags: undefined});
        expect(gaugeStatsd.set).to.have.been.called;
      });

      it('GaugeMetricController.setWithTags() should trigger set() function using {tag: `gauge`}', () => {
        controller.setWithTags();
        expect(gaugePrometheus.set).to.have.been.calledWith({delta: 2, tags: {tag: 'gauge'}});
      });

      it('GaugeMetricController.setWithDecorator() should trigger set() function using a decorator', async () => {
        await controller.setWithDecorator();

        expect(gaugePrometheus.set).to.have.been.called;
        expect(gaugeStatsd.set).to.not.have.been.called;
      });
    });

    // startTimer

    describe('startTimer()', () => {
      it('GaugeMetricController.startTimerAllAdapters() should trigger startTimer() function on all gauge adapters', async () => {
        await controller.startTimerAllAdapters();
        expect(gaugePrometheus.startTimer).to.have.been.called;
        expect(gaugeStatsd.startTimer).to.have.been.called;
      });

      it('GaugeMetricController.startTimerByAdapter() should trigger startTimer() function on all `prometheus` gauge adapters', async () => {
        await controller.startTimerByAdapter('prometheus');
        expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: undefined});
        expect(gaugeStatsd.startTimer).to.not.have.been.called;
      });

      it('GaugeMetricController.startTimerByMetric() should trigger startTimer() function on all `gauge` gauge adapters', async () => {
        await controller.startTimerByMetric(metricName);
        expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: undefined});
        expect(gaugeStatsd.startTimer).to.have.been.called;
      });

      it('GaugeMetricController.startTimerWithTags() should trigger startTimer() function using {tag: `gauge`}', async () => {
        await controller.startTimerWithTags();
        expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: {tag: 'gauge'}});
      });

      it('GaugeMetricController.startTimerWithEndTags() should trigger startTimer() function using {tag: `gauge`}', async () => {
        await controller.startTimerWithEndTags();
        expect(endTimer).to.have.been.calledWith({tags: {tag: 'gauge'}});
      });

      it('GaugeMetricController.startTimerWithDecorator() should trigger startTimer() function using a decorator', async () => {
        await controller.startTimerWithDecorator();

        expect(gaugePrometheus.startTimer).to.have.been.called;
        expect(gaugeStatsd.startTimer).to.not.have.been.called;
      });
    });

    // reset

    describe('reset()', () => {
      it('GaugeMetricController.resetByAdapter() should trigger reset() function on all gauge adapters', () => {
        controller.resetAllAdapters();
        expect(gaugePrometheus.reset).to.have.been.called;
        expect(gaugeStatsd.reset).to.have.been.called;
      });

      it(`GaugeMetricController.resetByAdapter('prometheus') should trigger reset() function on all 'prometheus' gauge adapters`, () => {
        controller.resetByAdapter('prometheus');
        expect(gaugePrometheus.reset).to.have.been.called;
        expect(gaugeStatsd.reset).to.not.have.been.called;
      });

      it(`GaugeMetricController.resetByMetricName('${metricName}') should trigger reset() function on all gauge adapters`, () => {
        controller.resetByMetricName(metricName);
        expect(gaugePrometheus.reset).to.have.been.called;
        expect(gaugeStatsd.reset).to.have.been.called;
      });

      it('GaugeMetricController.resetWithDecorator() should trigger reset() function using a decorator', async () => {
        await controller.resetWithDecorator();

        expect(gaugePrometheus.reset).to.have.been.called;
        expect(gaugeStatsd.reset).to.not.have.been.called;
      });
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
