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

const gauge = nanoid();

const gaugePrometheus = new GaugePrometheus();
const gaugeStatsd = new GaugeStatsd();

const metricAdapters = [
  {
    adapter: gaugePrometheus,
    metric: gauge,
  },
  {
    adapter: gaugeStatsd,
    metric: gauge,
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
      sandbox.spy(gaugeStatsd, 'dec');
      sandbox.spy(gaugeStatsd, 'inc');
      sandbox.spy(gaugeStatsd, 'set');
      sandbox.spy(gaugeStatsd, 'startTimer');

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

    it('GaugeMetricController.decByAdapter() should trigger dec() function on all gauge adapters', () => {
      controller.decAllAdapters();
      expect(gaugePrometheus.dec).to.have.been.called;
      expect(gaugeStatsd.dec).to.have.been.called;
    });

    it('GaugeMetricController.decByAdapter() should trigger dec() function on all `prometheus` gauge adapters', () => {
      controller.decByAdapter('prometheus');
      expect(gaugePrometheus.dec).to.have.been.called;
      expect(gaugeStatsd.dec).to.not.have.been.called;
    });

    it('GaugeMetricController.decByMetricLabel() should trigger dec() function on all `gauge` gauge adapters', () => {
      controller.decByMetricLabel(gauge);
      expect(gaugePrometheus.dec).to.have.been.called;
      expect(gaugeStatsd.dec).to.have.been.called;
    });

    it('GaugeMetricController.decWithDelta() should trigger dec() function using {delta: 2}', () => {
      controller.decWithDelta();
      expect(gaugePrometheus.dec).to.have.been.calledWith({delta: 2, tags: undefined});
    });

    it('GaugeMetricController.decWithDeltaAndTags() should trigger dec() function using {tag: `gauge`}', () => {
      controller.decWithDeltaAndTags();
      expect(gaugePrometheus.dec).to.have.been.calledWith({delta: 1, tags: {tag: 'gauge'}});
    });

    // TODO: Determine why this isn't working (manual test does)
    // TODO: implement
    // it.skip('GaugeMetricController.decWithDecorator() should trigger dec() function using a decorator', async () => {
    //   await controller.decWithDecorator();

    //   expect(gaugePrometheus.dec).to.have.been.called;
    //   expect(gaugeStatsd.dec).to.not.have.been.called;
    // });

    // inc

    it('GaugeMetricController.incByAdapter() should trigger inc() function on all gauge adapters', () => {
      controller.incAllAdapters();
      expect(gaugePrometheus.inc).to.have.been.called;
      expect(gaugeStatsd.inc).to.have.been.called;
    });

    it('GaugeMetricController.incByAdapter() should trigger inc() function on all `prometheus` gauge adapters', () => {
      controller.incByAdapter('prometheus');
      expect(gaugePrometheus.inc).to.have.been.called;
      expect(gaugeStatsd.inc).to.not.have.been.called;
    });

    it('GaugeMetricController.incByMetricLabel() should trigger inc() function on all `gauge` gauge adapters', () => {
      controller.incByMetricLabel(gauge);
      expect(gaugePrometheus.inc).to.have.been.called;
      expect(gaugeStatsd.inc).to.have.been.called;
    });

    it('GaugeMetricController.incWithDelta() should trigger inc() function using {delta: 2}', () => {
      controller.incWithDelta();
      expect(gaugePrometheus.inc).to.have.been.calledWith({delta: 2, tags: undefined});
    });

    it('GaugeMetricController.incWithDeltaAndTags() should trigger inc() function using {tag: `gauge`}', () => {
      controller.incWithDeltaAndTags();
      expect(gaugePrometheus.inc).to.have.been.calledWith({delta: 1, tags: {tag: 'gauge'}});
    });

    // TODO: Determine why this isn't working (manual test does)
    it.skip('GaugeMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
      await controller.incWithDecorator();

      expect(gaugePrometheus.inc).to.have.been.called;
      expect(gaugeStatsd.inc).to.not.have.been.called;
    });

    // set

    it('GaugeMetricController.setByAdapter() should trigger set() function on all `prometheus` gauge adapters', () => {
      controller.setByAdapter('prometheus');
      expect(gaugePrometheus.set).to.have.been.calledWith({delta: 1, tags: undefined});
      expect(gaugeStatsd.set).to.not.have.been.called;
    });

    it('GaugeMetricController.setByMetricLabel() should trigger set() function on all `gauge` gauge adapters', () => {
      controller.setByMetricLabel(gauge);
      expect(gaugePrometheus.set).to.have.been.calledWith({delta: 1, tags: undefined});
      expect(gaugeStatsd.set).to.have.been.called;
    });

    it('GaugeMetricController.setWithTags() should trigger set() function using {tag: `gauge`}', () => {
      controller.setWithTags();
      expect(gaugePrometheus.set).to.have.been.calledWith({delta: 1, tags: {tag: 'gauge'}});
    });

    // // TODO: Determine why this isn't working (manual test does)
    // it.skip('GaugeMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
    //   await controller.incWithDecorator();

    //   expect(gaugePrometheus.inc).to.have.been.called;
    //   expect(gaugeStatsd.inc).to.not.have.been.called;
    // });

    // startTimer

    it('GaugeMetricController.timeByAdapter() should trigger startTimer() function on all `prometheus` gauge adapters', async () => {
      await controller.timeByAdapter('prometheus');
      expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: undefined});
      expect(gaugeStatsd.startTimer).to.not.have.been.called;
    });

    it('GaugeMetricController.timeByMetricLabel() should trigger startTimer() function on all `gauge` gauge adapters', async () => {
      await controller.timeByMetricLabel(gauge);
      expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: undefined});
      expect(gaugeStatsd.startTimer).to.have.been.called;
    });

    it('GaugeMetricController.timeWithTags() should trigger startTimer() function using {tag: `gauge`}', async () => {
      await controller.timeWithTags();
      expect(gaugePrometheus.startTimer).to.have.been.calledWith({tags: {tag: 'gauge'}});
    });

    it('GaugeMetricController.timeWithEndTags() should trigger startTimer() function using {tag: `gauge`}', async () => {
      await controller.timeWithEndTags();
      expect(endTimer).to.have.been.calledWith({tags: {tag: 'gauge'}});
    });

    // // TODO: Determine why this isn't working (manual test does)
    // it.skip('GaugeMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
    //   await controller.incWithDecorator();

    //   expect(gaugePrometheus.inc).to.have.been.called;
    //   expect(gaugeStatsd.inc).to.not.have.been.called;
    // });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
