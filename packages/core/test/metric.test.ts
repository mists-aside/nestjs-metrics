import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Counter, Gauge, Histogram, Summary} from '../src/metric';
import {InjectableMetricsController, withValues, withValues2} from '../src/test/utils/controllers';
import {TestHarness, createTestModule} from '../src/test/utils';

chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  let harness: TestHarness;
  let controller: InjectableMetricsController;
  let sandbox: sinon.SinonSandbox;

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    harness = await createTestModule(
      {
        adapters: {},
      },
      {
        controllers: [InjectableMetricsController],
        providers: [Counter, Gauge, Histogram, Summary],
      },
    );

    controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);

    sandbox = sinon.createSandbox();

    sandbox.spy(controller.counter, 'inc');

    sandbox.spy(controller.gauge, 'dec');
    sandbox.spy(controller.gauge, 'inc');
    sandbox.spy(controller.gauge, 'set');
    sandbox.spy(controller.gauge, 'startTimer');

    sandbox.spy(controller.histogram, 'observe');
    sandbox.spy(controller.histogram, 'reset');
    sandbox.spy(controller.histogram, 'startTimer');

    sandbox.spy(controller.summary, 'observe');
    sandbox.spy(controller.summary, 'reset');
    sandbox.spy(controller.summary, 'startTimer');
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
    it(`Counter.inc(${JSON.stringify(
      withValues('counter'),
    )}, 'counter') should be called with proper values`, async () => {
      controller.counterInc();

      expect(controller.counter.inc).to.have.been.called;
      expect(controller.counter.inc).to.have.been.calledWith(...withValues('counter'), 'counter');
    });

    it(`Counter.inc() should be called with proper values`, async () => {
      controller.counterIncNoData();

      expect(controller.counter.inc).to.have.been.called;
      expect(controller.counter.inc).to.have.been.calledWith();
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Gauge', () => {
    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeDec();

      expect(controller.gauge.dec).to.have.been.called;
      expect(controller.gauge.dec).to.have.been.calledWith(...withValues('gauge'), 'gauge');
    });

    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeDecNoData();

      expect(controller.gauge.dec).to.have.been.called;
      expect(controller.gauge.dec).to.have.been.calledWith();
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeInc();

      expect(controller.gauge.inc).to.have.been.called;
      expect(controller.gauge.inc).to.have.been.calledWith(...withValues('gauge'), 'gauge');
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeIncNoData();

      expect(controller.gauge.inc).to.have.been.called;
      expect(controller.gauge.inc).to.have.been.calledWith();
    });

    it(`Gauge.set(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      controller.gaugeSet();

      expect(controller.gauge.set).to.have.been.called;
      expect(controller.gauge.set).to.have.been.calledWith(...withValues('gauge'), 'gauge');
    });

    it(`Gauge.startTimer(${JSON.stringify(withValues2('gauge'))}) should be called`, async () => {
      await controller.gaugeStartTimer();

      expect(controller.gauge.startTimer).to.have.been.called;
      expect(controller.gauge.startTimer).to.have.been.calledWith(...withValues2('gauge'), 'gauge');
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Histogram', () => {
    it(`Histogram.observe(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      controller.histogramObserve();

      expect(controller.histogram.observe).to.have.been.called;
      expect(controller.histogram.observe).to.have.been.calledWith(...withValues('histogram'));
    });

    it(`Histogram.reset(${JSON.stringify(withValues('histogram'))}) should be called with proper values`, async () => {
      controller.histogramReset();

      expect(controller.histogram.reset).to.have.been.called;
      expect(controller.histogram.reset).to.have.been.calledWith(...withValues2('histogram'));
    });

    it(`Histogram.startTimer(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      controller.histogramStartTimer();

      expect(controller.histogram.startTimer).to.have.been.called;
      expect(controller.histogram.startTimer).to.have.been.calledWith(...withValues2('histogram'), 'histogram');
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Summary', () => {
    it(`Summary.observe(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      controller.summaryObserve();

      expect(controller.summary.observe).to.have.been.called;
      expect(controller.summary.observe).to.have.been.calledWith(...withValues('summary'));
    });

    it(`Summary.reset(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      controller.summaryReset();

      expect(controller.summary.reset).to.have.been.called;
      expect(controller.summary.reset).to.have.been.calledWith(...withValues2('summary'));
    });

    it(`Summary.startTimer(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      controller.summaryStartTimer();

      expect(controller.summary.startTimer).to.have.been.called;
      expect(controller.summary.startTimer).to.have.been.calledWith(...withValues2('summary'), 'summary');
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
