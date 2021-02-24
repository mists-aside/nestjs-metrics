/* eslint-disable mocha/no-mocha-arrows */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import { describe, it } from 'mocha';
import { nanoid } from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { Adapter } from '../src/adapters';
import { CounterAdapter } from '../src/adapters';
import { Config } from '../src/config';
import { Metric } from '../src/metrics/metric';

// import {Counter, Gauge, Histogram, Summary} from '../src/metrics';
// import {InjectableMetricsController} from '../src/test/utils/controllers';
// import {TestHarness, createTestModule} from '../src/test/utils';

chai.use(sinonChai);
const expect = chai.expect;

class Counter1 extends CounterAdapter {}
class Counter2 extends CounterAdapter {}
class Counter3 extends CounterAdapter {}

const counter1 = nanoid()
const counter2 = nanoid()
const counter3 = nanoid()

const counterAdapters = {}
counterAdapters[counter1] = new Counter1()
counterAdapters[counter2] = new Counter2()
counterAdapters[counter3] = new Counter3()

Config.getInstance().addAdapters(counterAdapters)

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {

  describe('Metric', () => {
    let metric: Metric | undefined;

    beforeEach(() => {
      metric = new Metric()
    })

    afterEach(() => {
      metric = undefined
    })

    it('::constructor() should create a valid object', () => {
      expect(metric).to.be.an('object')
    })

    it('::searchAdapters("name") to return a specific adapter (as an array)', () => {
      expect(metric.searchAdapters(counter1)).to.be.an('array')
      expect(metric.searchAdapters(counter1).length).to.equal(1)
      expect(metric.searchAdapters(counter1)[0] instanceof Counter1).to.be.true
    })

    it('::searchAdapters(CounterAdapter) to return a specific adapter (as an array)', () => {
      expect(metric.searchAdapters(CounterAdapter)).to.be.an('array')
      expect(metric.searchAdapters(CounterAdapter).length).to.equal(3)
      expect(metric.searchAdapters(CounterAdapter)[0] instanceof CounterAdapter).to.be.true
    })

    it('::searchAdapters(() => {}) to return a specific adapter (as an array)', () => {
      const method = (adapter: Adapter): boolean => adapter instanceof CounterAdapter;
      expect(metric.searchAdapters(method)).to.be.an('array')
      expect(metric.searchAdapters(method).length).to.equal(3)
      expect(metric.searchAdapters(method)[0] instanceof CounterAdapter).to.be.true
    })
  })


  // let harness: TestHarness;
  // let controller: InjectableMetricsController;
  // let sandbox: sinon.SinonSandbox;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // beforeEach(async () => {
  //   harness = await createTestModule(
  //     {
  //       adapters: {},
  //     },
  //     {
  //       controllers: [InjectableMetricsController],
  //       providers: [Counter, Gauge, Histogram, Summary],
  //     },
  //   );

  //   controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);

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
