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

const counter1 = nanoid();
const counter2 = nanoid();

const counter1AdapterProm = new CounterPrometheus();
const counter2AdapterProm = new CounterPrometheus();
const counter2AdapterStatsd = new CounterStatsd();

const gauge = nanoid();

const gaugePrometheus = new GaugePrometheus();

const metricAdapters = [
  {
    adapter: counter1AdapterProm,
    metric: counter1,
  },
  {
    adapter: counter2AdapterProm,
    metric: counter2,
  },
  {
    adapter: counter2AdapterStatsd,
    metric: counter2,
  },
  {
    adapter: gaugePrometheus,
    metric: gauge,
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
      sandbox.spy(counter1AdapterProm, 'inc');
      sandbox.spy(counter2AdapterProm, 'inc');
      sandbox.spy(counter2AdapterStatsd, 'inc');
      sandbox.spy(gaugePrometheus, 'inc');

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

    it('CounterMetricController.incByAdapter() should trigger inc() function on all counter adapters', () => {
      controller.incAllAdapters();
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterStatsd.inc).to.have.been.called;

      expect(gaugePrometheus.inc).to.not.have.been.called;
    });

    it('CounterMetricController.incByAdapter() should trigger inc() function on all `prometheus` counter adapters', () => {
      controller.incByAdapter('prometheus');
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;

      expect(gaugePrometheus.inc).to.not.have.been.called;
    });

    it('CounterMetricController.incByMetricLabel() should trigger inc() function on all `counter1` counter adapters', () => {
      controller.incByMetricLabel(counter1);
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.not.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;

      expect(gaugePrometheus.inc).to.not.have.been.called;
    });

    it('CounterMetricController.incWithDelta() should trigger inc() function using {delta: 2}', () => {
      controller.incWithDelta();
      expect(counter1AdapterProm.inc).to.have.been.calledWith({delta: 2, tags: undefined});
    });

    it('CounterMetricController.incWithDeltaAndTags() should trigger inc() function using {tag: `counter`}', () => {
      controller.incWithDeltaAndTags();
      expect(counter1AdapterProm.inc).to.have.been.calledWith({delta: 1, tags: {tag: 'counter'}});
    });

    it.skip('CounterMetricController.incWithDecorator() should trigger inc() function using a decorator', async () => {
      await controller.incWithDecorator();

      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.not.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
