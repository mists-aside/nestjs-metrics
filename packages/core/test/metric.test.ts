/* eslint-disable mocha/no-mocha-arrows */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {CounterAdapter} from '../src/adapters';
import {AdapterItem, Config} from '../src/config';
import {Adapter, AdapterKinds} from '../src/interfaces';
import {CounterMetric, CounterMetricOptions} from '../src/metrics';
import {Metric} from '../src/metrics/metric';
import {createTestModule, TestHarness} from '../src/test/utils';
import {CounterMetricInjectedController} from '../src/test/utils/controllers';

chai.use(sinonChai);
const expect = chai.expect;

class Counter1 extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CounterMetricOptions): void {
    return;
  }
}
class Counter2Prom extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CounterMetricOptions): void {
    return;
  }
}
class Counter2Statsd extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CounterMetricOptions): void {
    return;
  }
}

const counter1 = nanoid();
const counter2 = nanoid();

const counter1AdapterProm = new Counter1();
const counter2AdapterProm = new Counter2Prom();
const counter2AdapterStatsd = new Counter2Statsd();

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
];

Config.getInstance().addAdapters(metricAdapters);

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  describe('Metric', () => {
    let metric: Metric | undefined;

    beforeEach(() => {
      metric = new Metric();
    });

    afterEach(() => {
      metric = undefined;
    });

    it('::constructor() should create a valid object', () => {
      expect(metric).to.be.an('object');
    });

    it('::searchAdapters("name") to return a specific adapter (as an array)', () => {
      expect(metric.searchAdapters(counter1)).to.be.an('array');
      expect(metric.searchAdapters(counter1).length).to.equal(1);
      expect(metric.searchAdapters(counter1)[0].adapter instanceof Counter1).to.be.true;
    });

    it('::searchAdapters(CounterAdapter) to return a specific adapter (as an array)', () => {
      expect(metric.searchAdapters({metricKind: 'counter'})).to.be.an('array');
      expect(metric.searchAdapters({metricKind: 'counter'}).length).to.equal(3);
      expect(metric.searchAdapters({metricKind: 'counter'})[0].adapter instanceof CounterAdapter).to.be.true;
    });

    it('::searchAdapters(() => {}) to return a specific adapter (as an array)', () => {
      const method = (item: AdapterItem): boolean => item.adapter instanceof CounterAdapter;
      expect(metric.searchAdapters(method)).to.be.an('array');
      expect(metric.searchAdapters(method).length).to.equal(3);
      expect(metric.searchAdapters(method)[0].adapter instanceof CounterAdapter).to.be.true;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Controller(Metric::CounterMetric)', () => {
    let harness: TestHarness;
    let controller: CounterMetricInjectedController;
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.spy(counter1AdapterProm, 'inc');
      sandbox.spy(counter2AdapterProm, 'inc');
      sandbox.spy(counter2AdapterStatsd, 'inc');

      harness = await createTestModule(
        {
          adapters: [],
        },
        {
          controllers: [CounterMetricInjectedController],
          providers: [CounterMetric.getProvider()],
        },
      );

      controller = harness.app.get<CounterMetricInjectedController>(CounterMetricInjectedController);
    });

    afterEach(async () => {
      await harness.app.close();

      harness = undefined;
      controller = undefined;

      sandbox.restore();
      sandbox = undefined;
    });

    it('CounterMetricInjectedController.incByAdapter() should trigger inc() function on all counter adapters', () => {
      controller.incAllAdapters();
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterStatsd.inc).to.have.been.called;

      metricAdapters
        .filter((item) => item.adapter.metricKind !== 'counter')
        .forEach((item) => {
          expect(item.adapter.inc).to.not.have.been.called;
        });
    });

    it('CounterMetricInjectedController.incByAdapter() should trigger inc() function on all `prometheus` counter adapters', () => {
      controller.incByAdapter('prometheus');
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;

      metricAdapters
        .filter((item) => item.adapter.metricKind !== 'counter')
        .forEach((item) => {
          expect(item.adapter.inc).to.not.have.been.called;
        });
    });

    it('CounterMetricInjectedController.incByMetricLabel() should trigger inc() function on all `counter1` counter adapters', () => {
      controller.incByMetricLabel(counter1);
      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.not.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;

      metricAdapters
        .filter((item) => item.metric !== counter1)
        .forEach((item) => {
          expect(item.adapter.inc).to.not.have.been.called;
        });
    });

    it('CounterMetricInjectedController.incWithDelta() should trigger inc() function using {delta: 2}', () => {
      controller.incWithDelta();
      expect(counter1AdapterProm.inc).to.have.been.calledWith({delta: 2, tags: undefined});
    });

    it('CounterMetricInjectedController.incWithDeltaAndTags() should trigger inc() function using {tag: `counter`}', () => {
      controller.incWithDeltaAndTags();
      expect(counter1AdapterProm.inc).to.have.been.calledWith({delta: 1, tags: {tag: 'counter'}});
    });

    it.skip('CounterMetricInjectedController.incWithDecorator() should trigger inc() function using a decorator', async () => {
      await controller.incWithDecorator();

      expect(counter1AdapterProm.inc).to.have.been.called;
      expect(counter2AdapterProm.inc).to.not.have.been.called;
      expect(counter2AdapterStatsd.inc).to.not.have.been.called;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  // let harness: TestHarness;
  // let controller: InjectableMetricsController;
  // let sandbox: sinon.SinonSandbox;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // beforeEach(async () => {
  // harness = await createTestModule(
  //   {
  //     adapters: {},
  //   },
  //   {
  //     controllers: [InjectableMetricsController],
  //     providers: [Counter, Gauge, Histogram, Summary],
  //   },
  // );

  // controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);

  //   sandbox = sinon.createSandbox();

  //   sandbox.spy(controller.counter, 'inc');

  //   sandbox.spy(controller.gauge, 'dec');
  //   sandbox.spy(controller.gauge, 'inc');
  //   sandbox.spy(controller.gauge, 'set');
  //   sandbox.spy(controller.gauge, 'startTimer');

  //   sandbox.spy(controller.histogram, 'observe');
  //   sandbox.spy(controller.histogram, 'reset');
  //   sandbox.spy(controller.histogram, 'startTimer');

  //   sandbox.spy(controller.summary, 'observe');
  //   sandbox.spy(controller.summary, 'reset');
  //   sandbox.spy(controller.summary, 'startTimer');
  // });

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // afterEach(async () => {
  //   if (harness) {
  //     await harness.app.close();
  //     harness = undefined;
  //   }

  //   sandbox.restore();
  // });

  // describe('Counter', () => {
  //   it(`Counter.inc() should be called`, async () => {
  //     controller.counterInc();
  //     expect(controller.counter.inc).to.have.been.called;
  //     expect(controller.counter.inc).to.have.been.calledWith();
  //   });

  //   it(`Counter.inc(${JSON.stringify(incValuesDelta)} should be called with proper values`, async () => {
  //     controller.counterIncDelta();
  //     expect(controller.counter.inc).to.have.been.called;
  //     expect(controller.counter.inc).to.have.been.calledWith(incValuesDelta);
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Gauge', () => {
  //   it(`Gauge.dec() should be called`, async () => {
  //     controller.gaugeDec();

  //     expect(controller.gauge.dec).to.have.been.called;
  //     expect(controller.gauge.dec).to.have.been.calledWith();
  //   });

  //   it(`Gauge.dec(${JSON.stringify(decValuesDelta)}) should be called with proper values`, async () => {
  //     controller.gaugeDec();

  //     expect(controller.gauge.dec).to.have.been.called;
  //     expect(controller.gauge.dec).to.have.been.calledWith(decValuesDelta);
  //   });

  //   // it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //   //   controller.gaugeInc();

  //   //   expect(controller.gauge.inc).to.have.been.called;
  //   //   expect(controller.gauge.inc).to.have.been.calledWith(...withValues('gauge'), 'gauge');
  //   // });

  //   // it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //   //   controller.gaugeIncNoData();

  //   //   expect(controller.gauge.inc).to.have.been.called;
  //   //   expect(controller.gauge.inc).to.have.been.calledWith();
  //   // });

  //   // it(`Gauge.set(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //   //   controller.gaugeSet();

  //   //   expect(controller.gauge.set).to.have.been.called;
  //   //   expect(controller.gauge.set).to.have.been.calledWith(...withValues('gauge'), 'gauge');
  //   // });

  //   // it(`Gauge.startTimer(${JSON.stringify(withValues2('gauge'))}) should be called`, async () => {
  //   //   await controller.gaugeStartTimer();

  //   //   expect(controller.gauge.startTimer).to.have.been.called;
  //   //   expect(controller.gauge.startTimer).to.have.been.calledWith(...withValues2('gauge'), 'gauge');
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Histogram', () => {
  //   // it(`Histogram.observe(${JSON.stringify(
  //   //   withValues('histogram'),
  //   // )}) should be called with proper values`, async () => {
  //   //   controller.histogramObserve();

  //   //   expect(controller.histogram.observe).to.have.been.called;
  //   //   expect(controller.histogram.observe).to.have.been.calledWith(...withValues('histogram'));
  //   // });

  //   // it(`Histogram.reset(${JSON.stringify(withValues('histogram'))}) should be called with proper values`, async () => {
  //   //   controller.histogramReset();

  //   //   expect(controller.histogram.reset).to.have.been.called;
  //   //   expect(controller.histogram.reset).to.have.been.calledWith(...withValues2('histogram'));
  //   // });

  //   // it(`Histogram.startTimer(${JSON.stringify(
  //   //   withValues('histogram'),
  //   // )}) should be called with proper values`, async () => {
  //   //   controller.histogramStartTimer();

  //   //   expect(controller.histogram.startTimer).to.have.been.called;
  //   //   expect(controller.histogram.startTimer).to.have.been.calledWith(...withValues2('histogram'), 'histogram');
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Summary', () => {
  //   // it(`Summary.observe(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
  //   //   controller.summaryObserve();

  //   //   expect(controller.summary.observe).to.have.been.called;
  //   //   expect(controller.summary.observe).to.have.been.calledWith(...withValues('summary'));
  //   // });

  //   // it(`Summary.reset(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
  //   //   controller.summaryReset();

  //   //   expect(controller.summary.reset).to.have.been.called;
  //   //   expect(controller.summary.reset).to.have.been.calledWith(...withValues2('summary'));
  //   // });

  //   // it(`Summary.startTimer(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
  //   //   controller.summaryStartTimer();

  //   //   expect(controller.summary.startTimer).to.have.been.called;
  //   //   expect(controller.summary.startTimer).to.have.been.calledWith(...withValues2('summary'), 'summary');
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
