import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {Controller} from '@nestjs/common';

import {Tags} from '../src/adapter';
import {Counter, Gauge, Histogram, Summary} from '../src/metric';
import {TestHarness} from './utils/harness';
import {createTestModule} from './utils/module';

chai.use(sinonChai);
const expect = chai.expect;

const withValues = (prefix = 'counter'): [number?, string?, Tags?] => [1, `${prefix}_label`, {tag: prefix}];
const withValues2 = (prefix = 'counter'): [string?, Tags?] => [`${prefix}_label`, {tag: prefix}];
const withValues3 = (prefix = 'counter'): [Tags?] => [{tag: prefix}];

Counter.prototype.inc = sinon.spy();

Gauge.prototype.dec = sinon.spy();
Gauge.prototype.inc = sinon.spy();
Gauge.prototype.set = sinon.spy();
Gauge.prototype.startTimer = sinon.spy();

Histogram.prototype.observe = sinon.spy();
Histogram.prototype.reset = sinon.spy();
Histogram.prototype.startTimer = (label?: string, tags?: Tags) => sinon.spy();

Summary.prototype.observe = sinon.spy();
Summary.prototype.reset = sinon.spy();
Summary.prototype.startTimer = (label?: string, tags?: Tags) => sinon.spy();

@Controller()
class InjectableMetricsController {
  constructor(public counter: Counter, public gauge: Gauge, public histogram: Histogram, public summary: Summary) {}

  counterInc() {
    this.counter.inc(...withValues('counter'));
  }
  counterIncNoData() {
    this.counter.inc();
  }

  gaugeDec() {
    this.gauge.dec(...withValues('gauge'));
  }
  gaugeDecNoData() {
    this.gauge.dec();
  }
  gaugeInc() {
    this.gauge.inc(...withValues('gauge'));
  }
  gaugeIncNoData() {
    this.gauge.inc();
  }
  gaugeSet() {
    this.gauge.set(...withValues('gauge'));
  }
  gaugeStartTimer() {
    this.gauge.startTimer(...withValues2('gauge'));
  }

  histogramObserve() {
    this.histogram.observe(...withValues('histogram'));
  }
  histogramReset() {
    this.histogram.reset(...withValues2('histogram'));
  }
  histogramStartTimer() {
    const end = this.histogram.startTimer(...withValues2('histogram'));
    return new Promise((resolve) =>
      setTimeout(() => {
        end(...withValues3('histogram'));
        resolve(end);
      }, 200),
    );
  }

  summaryObserve() {
    this.summary.observe(...withValues('summary'));
  }
  summaryReset() {
    this.summary.reset(...withValues2('summary'));
  }
  summaryStartTimer() {
    const end = this.summary.startTimer(...withValues2('summary'));
    return new Promise((resolve) =>
      setTimeout(() => {
        end(...withValues3('summary'));
        resolve(end);
      }, 200),
    );
  }
}

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/module', function () {
  let harness: TestHarness;

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
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    if (harness) {
      await harness.app.close();
      harness = undefined;
    }
  });

  describe('Counter', () => {
    it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.counterInc();

      expect(controller.counter.inc).to.have.been.called;
      expect(controller.counter.inc).to.have.been.calledWith(...withValues('counter'));
    });

    it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.counterIncNoData();

      expect(controller.counter.inc).to.have.been.called;
      expect(controller.counter.inc).to.have.been.calledWith(1);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Gauge', () => {
    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.gaugeDec();

      expect(controller.gauge.dec).to.have.been.called;
      expect(controller.gauge.dec).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.gaugeDecNoData();

      expect(controller.gauge.dec).to.have.been.called;
      expect(controller.gauge.dec).to.have.been.calledWith(1);
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.gaugeInc();

      expect(controller.gauge.inc).to.have.been.called;
      expect(controller.gauge.inc).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.gaugeIncNoData();

      expect(controller.gauge.inc).to.have.been.called;
      expect(controller.gauge.inc).to.have.been.calledWith(1);
    });

    it(`Gauge.set(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.gaugeSet();

      expect(controller.gauge.set).to.have.been.called;
      expect(controller.gauge.set).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.startTimer(${JSON.stringify(withValues('gauge'))}) should be called`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      const endTimer = await controller.gaugeStartTimer();

      expect(controller.gauge.startTimer).to.have.been.called;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Histogram', () => {
    it(`Histogram.observe(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.histogramObserve();

      expect(controller.histogram.observe).to.have.been.called;
      expect(controller.histogram.observe).to.have.been.calledWith(...withValues('histogram'));
    });

    it(`Histogram.reset(${JSON.stringify(withValues('histogram'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.histogramReset();

      expect(controller.histogram.reset).to.have.been.called;
      expect(controller.histogram.reset).to.have.been.calledWith(...withValues2('histogram'));
    });

    it(`Histogram.startTimer(${JSON.stringify(
      withValues('histogram'),
    )}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      const endTimer = await controller.histogramStartTimer();

      // expect(controller.histogram.startTimer).to.have.been.called;
      // expect(controller.histogram.startTimer).to.have.been.calledWith(...withValues2('histogram'));
      expect(endTimer).to.have.been.called;
      expect(endTimer).to.have.been.calledWith(...withValues3('histogram'));
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Summary', () => {
    it(`Summary.observe(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.summaryObserve();

      expect(controller.summary.observe).to.have.been.called;
      expect(controller.summary.observe).to.have.been.calledWith(...withValues('summary'));
    });

    it(`Summary.reset(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      controller.summaryReset();

      expect(controller.summary.reset).to.have.been.called;
      expect(controller.summary.reset).to.have.been.calledWith(...withValues2('summary'));
    });

    it(`Summary.startTimer(${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController);
      const endTimer = await controller.summaryStartTimer();

      // expect(controller.summary.startTimer).to.have.been.called;
      // expect(controller.summary.startTimer).to.have.been.calledWith(...withValues2('summary'));
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
