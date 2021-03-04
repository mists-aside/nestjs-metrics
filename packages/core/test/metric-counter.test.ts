/* eslint-disable mocha/no-mocha-arrows */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Config} from '../src/config';
import {CounterMetric} from '../src/metrics';
import {CounterMetricController} from '../src/test';
import {TestHarness, createTestModule} from './utils';
import {CounterPrometheus, CounterStatsd, GaugePrometheus} from './utils/adapters';

chai.use(sinonChai);
const expect = chai.expect;

const metricName = nanoid();

const counterPrometheus = new CounterPrometheus();
const counterStatsd = new CounterStatsd();

const metricAdapters = [
  {
    adapter: counterPrometheus,
    metric: metricName,
  },
  {
    adapter: counterStatsd,
    metric: metricName,
  },
];

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  before(() => {
    Config.getInstance().clear();
    Config.getInstance().addAdapters(metricAdapters);
  });

  describe('Controller(CounterMetric)', () => {
    let harness: TestHarness;
    let controller: CounterMetricController;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.spy(counterPrometheus, 'inc');
      sandbox.spy(counterPrometheus, 'reset');
      sandbox.spy(counterStatsd, 'inc');
      sandbox.spy(counterStatsd, 'reset');

      harness = await createTestModule(
        {
          adapters: [],
        },
        {
          controllers: [CounterMetricController],
          providers: [CounterMetric.getProvider()],
        },
      );

      controller = harness.app.get<CounterMetricController>(CounterMetricController);
    });

    afterEach(async () => {
      await harness.app.close();

      harness = undefined;
      controller = undefined;

      sandbox.restore();
      sandbox = undefined;
    });

    // inc

    it('CounterMetricController.incByAdapter() should trigger inc() function on all counter adapters', () => {
      controller.incAllAdapters();
      expect(counterPrometheus.inc).to.have.been.called;
      expect(counterStatsd.inc).to.have.been.called;
    });

    it(`CounterMetricController.incByAdapter('prometheus') should trigger inc() function on all 'prometheus' counter adapters`, () => {
      controller.incByAdapter('prometheus');
      expect(counterPrometheus.inc).to.have.been.called;
      expect(counterStatsd.inc).to.not.have.been.called;
    });

    it(`CounterMetricController.incByMetricName('${metricName}') should trigger inc() function on all counter adapters`, () => {
      controller.incByMetricName(metricName);
      expect(counterPrometheus.inc).to.have.been.called;
      expect(counterStatsd.inc).to.have.been.called;
    });

    it('CounterMetricController.incWithDelta() should trigger inc() function using {delta: 2}', () => {
      controller.incWithDelta();
      expect(counterPrometheus.inc).to.have.been.calledWith({delta: 2, tags: undefined});
    });

    it('CounterMetricController.incWithDeltaAndTags() should trigger inc() function using {tag: `counter`}', () => {
      controller.incWithDeltaAndTags();
      expect(counterPrometheus.inc).to.have.been.calledWith({delta: 2, tags: {tag: 'counter'}});
    });

    // // TODO: investigate why decorators can't be tested
    // it.skip('CounterMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
    //   await controller.incWithDecorator();

    //   expect(counterPrometheus.inc).to.have.been.called;
    //   expect(counterStatsd.inc).to.not.have.been.called;
    // });

    // reset

    it('CounterMetricController.resetByAdapter() should trigger reset() function on all counter adapters', () => {
      controller.resetAllAdapters();
      expect(counterPrometheus.reset).to.have.been.called;
      expect(counterStatsd.reset).to.have.been.called;
    });

    it(`CounterMetricController.resetByAdapter('prometheus') should trigger reset() function on all 'prometheus' counter adapters`, () => {
      controller.resetByAdapter('prometheus');
      expect(counterPrometheus.reset).to.have.been.called;
      expect(counterStatsd.reset).to.not.have.been.called;
    });

    it(`CounterMetricController.resetByMetricName('${metricName}') should trigger reset() function on all counter adapters`, () => {
      controller.resetByMetricName(metricName);
      expect(counterPrometheus.reset).to.have.been.called;
      expect(counterStatsd.reset).to.have.been.called;
    });

    // // TODO: investigate why decorators can't be tested
    // it.skip('CounterMetricController.resetWithDecorator() should trigger reset() function using a decorator', async () => {
    //   await controller.resetWithDecorator();

    //   expect(counterPrometheus.reset).to.have.been.called;
    //   expect(counterStatsd.reset).to.not.have.been.called;
    // });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
