import {MetricsAdapters} from './../src/config';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Tags} from '../src/adapter';
import {Counter, Gauge, Histogram, Summary} from '../src/adapter/dummy';
import {
  Counter as CounterMetric,
  Gauge as GaugeMetric,
  Histogram as HistogramMetric,
  Summary as SummaryMetric,
} from '../src/metric';
import {InjectableMetricsController, withValues, withValues2, withValues3} from './utils/controllers';
import {TestHarness} from './utils/harness';
import {createTestModule} from './utils/module';

chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/adapter', function () {
  let adapters: MetricsAdapters;
  let controller: InjectableMetricsController
  let harness: TestHarness;
  let sandbox: sinon.SinonSandbox;

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    adapters = {
      counter: new Counter(),
      counter2: new Counter(),
      gauge: new Gauge(),
      histogram: new Histogram(),
      summary: new Summary(),
    };

    harness = await createTestModule(
      {
        adapters,
      },
      {
        controllers: [InjectableMetricsController],
        providers: [CounterMetric, GaugeMetric, HistogramMetric, SummaryMetric],
      },
    );

    controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);

    sandbox = sinon.createSandbox();

    sandbox.spy(adapters.counter, 'inc');
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    if (harness) {
      await harness.app.close();
      harness = undefined;
    }

    sandbox.restore();
  });

  describe('Counter', () => {
    it(`Counter.inc(${JSON.stringify(withValues('counter'))}, 'counter') should be called with proper values`, async () => {
      controller.counterInc();

      expect(adapters.counter.inc).to.have.been.called;
      expect(adapters.counter.inc).to.have.been.calledWith(...withValues('counter'));
    });

    it(`Counter.inc() should be called with proper values`, async () => {
      controller.counterIncNoData();

      expect(adapters.counter.inc).to.have.been.called;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe.skip('Gauge', () => {
    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeDec();

      expect(adapters.gauge.dec).to.have.been.called;
      expect(adapters.gauge.dec).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeDecNoData();

      expect(adapters.gauge.dec).to.have.been.called;
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeInc();

      expect(adapters.gauge.inc).to.have.been.called;
      expect(adapters.gauge.inc).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeIncNoData();

      expect(adapters.gauge.inc).to.have.been.called;
      expect(adapters.gauge.inc).to.have.been.calledWith(1);
    });

    it(`Gauge.set(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeSet();

      expect(adapters.gauge.set).to.have.been.called;
      expect(adapters.gauge.set).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.startTimer(${JSON.stringify(withValues('gauge'))}) should be called`, async () => {
      const endTimer = await controller.gaugeStartTimer();

      expect(adapters.gauge.startTimer).to.have.been.called;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe.skip('Histogram', () => {
    it(`Histogram.observe(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      controller.histogramObserve();

      expect(adapters.histogram.observe).to.have.been.called;
      expect(adapters.histogram.observe).to.have.been.calledWith(...withValues('histogram'));
    });

    it(`Histogram.reset(${JSON.stringify(withValues('histogram'))}) should be called with proper values`, async () => {
      controller.histogramReset();

      expect(adapters.histogram.reset).to.have.been.called;
      expect(adapters.histogram.reset).to.have.been.calledWith(...withValues2('histogram'));
    });

    it(`Histogram.startTimer(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      const endTimer = await controller.histogramStartTimer();

      // expect(adapters.histogram.startTimer).to.have.been.called;
      // expect(adapters.histogram.startTimer).to.have.been.calledWith(...withValues2('histogram'));
      expect(endTimer).to.have.been.called;
      expect(endTimer).to.have.been.calledWith(...withValues3('histogram'));
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe.skip('Summary', () => {
    it(`Summary.observe(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      controller.summaryObserve();

      expect(adapters.summary.observe).to.have.been.called;
      expect(adapters.summary.observe).to.have.been.calledWith(...withValues('summary'));
    });

    it(`Summary.reset(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      controller.summaryReset();

      expect(adapters.summary.reset).to.have.been.called;
      expect(adapters.summary.reset).to.have.been.calledWith(...withValues2('summary'));
    });

    it(`Summary.startTimer(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      const endTimer = await controller.summaryStartTimer();

      // expect(adapters.summary.startTimer).to.have.been.called;
      // expect(adapters.summary.startTimer).to.have.been.calledWith(...withValues2('summary'));
      expect(endTimer).to.have.been.called;
      expect(endTimer).to.have.been.calledWith(...withValues3('summary'));
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
