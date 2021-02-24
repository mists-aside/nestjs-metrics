/* eslint-disable mocha/no-mocha-arrows */
import * as chai from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { CounterAdapter } from '../src/adapters';
import { Errors } from '../src/errors';

// import {Counter, Gauge, Histogram, Summary} from '../src/adapter/dummies';
// import {Tags, TimerMethod} from '../src/adapter/interfaces';
// import {MetricsAdapters} from '../src/config';
// import {
//   Counter as CounterMetric,
//   Gauge as GaugeMetric,
//   Histogram as HistogramMetric,
//   Summary as SummaryMetric,
// } from '../src/metric';
// import {createTestModule} from '../src/test/utils';
// import {InjectableMetricsController} from '../src/test/utils/controllers';
// import {TestHarness} from '../src/test/utils/harness';

chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests,mocha/no-mocha-arrows
describe('src/adapter', () => {

  describe('CounterAdapter', () => {
    let adapter: CounterAdapter | undefined;

    beforeEach(() => {
      adapter = new CounterAdapter()
    })

    afterEach(() => {
      adapter = undefined;
    })

    it('::constructor() should create a valid object', () => {
      expect(adapter).to.be.an('object');
    })

    it('::inc() should throw an Error', () => {
      expect(() => { adapter.inc() }).to.throw(Errors.MethodNotImplemented('inc'));
    })

  })


  // let adapters: MetricsAdapters;
  // let controller: InjectableMetricsController;
  // let harness: TestHarness;
  // let sandbox: sinon.SinonSandbox;
  // // eslint-disable-next-line mocha/no-setup-in-describe
  // const endTimer = sinon.fake();

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // beforeEach(async () => {
  //   adapters = {
  //     counter: new Counter(),
  //     counter2: new Counter(),
  //     gauge: new Gauge(),
  //     histogram: new Histogram(),
  //     summary: new Summary(),
  //   };

  //   harness = await createTestModule(
  //     {
  //       adapters,
  //     },
  //     {
  //       controllers: [InjectableMetricsController],
  //       providers: [CounterMetric, GaugeMetric, HistogramMetric, SummaryMetric],
  //     },
  //   );

  //   controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);

  //   sandbox = sinon.createSandbox();

  //   sandbox.spy(adapters.counter, 'inc');

  //   sandbox.spy(adapters.gauge, 'dec');
  //   sandbox.spy(adapters.gauge, 'inc');
  //   sandbox.spy(adapters.gauge, 'set');
  //   sandbox.spy(adapters.gauge, 'startTimer');

  //   sandbox.spy(adapters.histogram, 'observe');
  //   sandbox.spy(adapters.histogram, 'reset');
  //   sandbox.spy(adapters.histogram, 'startTimer');

  //   sandbox.spy(adapters.summary, 'observe');
  //   sandbox.spy(adapters.summary, 'reset');
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   adapters.summary.startTimer = (label?: string, tags?: Tags, adapter?: string): TimerMethod =>
  //     endTimer as TimerMethod;
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
  //   // it(`Counter.inc(...${JSON.stringify(
  //   //   withIncValues('counter', 'counter'),
  //   // )}) should be called with: value, label, tags, adapter values`, async () => {
  //   //   controller.counterInc();

  //   //   expect(adapters.counter.inc).to.have.been.called;
  //   //   expect(adapters.counter.inc).to.have.been.calledWith(...withIncValues('counter', 'counter').slice(0, 3));
  //   // });

  //   // it(`Counter.inc(...${JSON.stringify(
  //   //   withIncNoTagsValues('counter', 'counter'),
  //   // )}) should be called with: value, label, no tags, adapter values`, async () => {
  //   //   controller.counterIncNoTags();

  //   //   expect(adapters.counter.inc).to.have.been.called;
  //   //   expect(adapters.counter.inc).to.have.been.calledWith(...withIncNoTagsValues('counter', 'counter').slice(0, 3));
  //   // });

  //   // it(`Counter.inc(...${JSON.stringify(
  //   //   withIncNoTagsNoLabelValues('counter', 'counter'),
  //   // )}) should be called with: value, no label, no tags, adapter values`, async () => {
  //   //   controller.counterIncNoTagsAndLabel();

  //   //   expect(adapters.counter.inc).to.have.been.called;
  //   //   expect(adapters.counter.inc).to.have.been.calledWith(
  //   //     ...withIncNoTagsNoLabelValues('counter', 'counter').slice(0, 2),
  //   //   );
  //   // });

  //   // it(`Counter.inc() should be called`, async () => {
  //   //   controller.counterIncNoData();

  //   //   expect(adapters.counter.inc).to.have.been.called;
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Gauge', () => {
  //   // it(`Gauge.dec(...${JSON.stringify(
  //   //   withDecValues('gauge', 'gauge'),
  //   // )}) should be called with: value, label, tags, adapter values`, async () => {
  //   //   controller.gaugeDec();

  //   //   expect(adapters.gauge.dec).to.have.been.called;
  //   //   expect(adapters.gauge.dec).to.have.been.calledWith(...withDecValues('gauge', 'gauge').slice(0, 3));
  //   // });

  //   // it(`Gauge.dec() should be called`, async () => {
  //   //   controller.gaugeDecNoData();

  //   //   expect(adapters.gauge.dec).to.have.been.called;
  //   // });

  //   // it(`Gauge.inc(...${JSON.stringify(
  //   //   withIncValues('gauge', 'gauge'),
  //   // )}) should be called with: value, label, tags, adapter values`, async () => {
  //   //   controller.gaugeInc();

  //   //   expect(adapters.gauge.inc).to.have.been.called;
  //   //   expect(adapters.gauge.inc).to.have.been.calledWith(...withIncValues('gauge', 'gauge').slice(0, 3));
  //   // });

  //   // it(`Gauge.inc(...${JSON.stringify(
  //   //   withIncNoTagsValues('gauge', 'gauge'),
  //   // )}) should be called with: value, label, no tags, adapter values`, async () => {
  //   //   controller.gaugeIncNoTags();

  //   //   expect(adapters.gauge.inc).to.have.been.called;
  //   //   expect(adapters.gauge.inc).to.have.been.calledWith(...withIncNoTagsValues('gauge', 'gauge').slice(0, 3));
  //   // });

  //   // it(`Gauge.inc(...${JSON.stringify(
  //   //   withIncNoTagsNoLabelValues('gauge', 'gauge'),
  //   // )}) should be called with: value, no label, no tags, adapter values`, async () => {
  //   //   controller.gaugeIncNoTagsAndLabel();

  //   //   expect(adapters.gauge.inc).to.have.been.called;
  //   //   expect(adapters.gauge.inc).to.have.been.calledWith(...withIncNoTagsNoLabelValues('gauge', 'gauge').slice(0, 2));
  //   // });

  //   // it(`Gauge.inc() should be called`, async () => {
  //   //   controller.gaugeIncNoData();

  //   //   expect(adapters.gauge.inc).to.have.been.called;
  //   // });

  //   // it(`Gauge.set(...${JSON.stringify(
  //   //   withSetValues('gauge', 'gauge'),
  //   // )}) should be called with: value, label, tags, adapter values`, async () => {
  //   //   controller.gaugeSet();

  //   //   expect(adapters.gauge.set).to.have.been.called;
  //   //   expect(adapters.gauge.set).to.have.been.calledWith(...withSetValues('gauge', 'gauge').slice(0, 3));
  //   // });

  //   // it(`Gauge.startTimer(...${JSON.stringify(withStartTimerValues('gauge', 'gauge'))}) should be called`, async () => {
  //   //   await controller.gaugeStartTimer();

  //   //   expect(adapters.gauge.startTimer).to.have.been.called;
  //   //   expect(adapters.gauge.startTimer).to.have.been.calledWith(...withStartTimerValues('gauge', 'gauge').slice(0, 2));
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Histogram', () => {
  //   // it(`Histogram.observe(...${JSON.stringify(
  //   //   withObserveValues('histogram', 'histogram'),
  //   // )}) should be called with: value, label, tags, adapter`, async () => {
  //   //   controller.histogramObserve();

  //   //   expect(adapters.histogram.observe).to.have.been.called;
  //   //   expect(adapters.histogram.observe).to.have.been.calledWith(
  //   //     ...withObserveValues('histogram', 'histogram').slice(0, 3),
  //   //   );
  //   // });

  //   // it(`Histogram.reset(...${JSON.stringify(
  //   //   withResetValues('histogram', 'histogram'),
  //   // )}) should be called with proper values`, async () => {
  //   //   controller.histogramReset();

  //   //   expect(adapters.histogram.reset).to.have.been.called;
  //   //   expect(adapters.histogram.reset).to.have.been.calledWith(
  //   //     ...withResetValues('histogram', 'histogram').slice(0, 2),
  //   //   );
  //   // });

  //   // it(`Histogram.startTimer(...${JSON.stringify(
  //   //   withStartTimerValues('histogram', 'histogram'),
  //   // )}) should be called with: value, label, tags, adapter`, async () => {
  //   //   await controller.histogramStartTimer();

  //   //   expect(adapters.histogram.startTimer).to.have.been.called;
  //   //   expect(adapters.histogram.startTimer).to.have.been.calledWith(
  //   //     ...withStartTimerValues('histogram', 'histogram').slice(0, 2),
  //   //   );
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Summary', () => {
  //   // it(`Summary.observe(...${JSON.stringify(
  //   //   withObserveValues('summary', 'summary'),
  //   // )}) should be called with: value, label, tags, adapter`, async () => {
  //   //   controller.summaryObserve();

  //   //   expect(adapters.summary.observe).to.have.been.called;
  //   //   expect(adapters.summary.observe).to.have.been.calledWith(...withObserveValues('summary', 'summary').slice(0, 3));
  //   // });

  //   // it(`Summary.reset(...${JSON.stringify(
  //   //   withResetValues('summary', 'summary'),
  //   // )}) should be called with proper values`, async () => {
  //   //   controller.summaryReset();

  //   //   expect(adapters.summary.reset).to.have.been.called;
  //   //   expect(adapters.summary.reset).to.have.been.calledWith(...withResetValues('summary', 'summary').slice(0, 2));
  //   // });

  //   // it(`Summary.startTimer(...${JSON.stringify(
  //   //   withStartTimerValues('summary', 'summary'),
  //   // )}) should be called with: label, tags, adapter`, async () => {
  //   //   await controller.summaryStartTimer();

  //   //   expect(endTimer).to.have.been.called;
  //   //   expect(endTimer).to.have.been.calledWith(...withEndTimerValues('summary'));
  //   // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
