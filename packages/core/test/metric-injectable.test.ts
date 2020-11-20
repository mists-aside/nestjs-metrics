import { createTestModule } from './utils/module';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {TestHarness} from './utils/harness';
import * as sinon from 'sinon';
import { Controller } from '@nestjs/common';

const withValues = (prefix = 'counter') => [1, `${prefix}_label`, { 'tag': prefix }]
const withValues2 = (prefix = 'counter') => [`${prefix}_label`, { 'tag': prefix }]
const withValues3 = (prefix = 'counter') => [{ 'tag': prefix }]

@Controller()
class InjectableMetricsController {

  constructor(
    private counter: Counter,
    private gauge: Gauge,
    private histogram: Histogram,
    private summary: Summary,
  ) {}

  counterInc() { this.counter.inc(...withValues('counter')) }
  counterIncNoData() { this.counter.inc(); }

  gaugeInc() { this.gauge.inc(...withValues('gauge')) }
  gaugeDec() { this.gauge.dec(...withValues('gauge')) }
  gaugeSet() { this.gauge.set(...withValues('gauge')) }

  histogramObserve() { this.histogram.observe(...withValues('histogram')) }
  histogramReset() { this.histogram.reset(...withValues2('histogram')) }
  histogramStartTimer() {
    const end = this.histogram.startTimer(...withValues2('histogram'))
    return new Promise(resolve => setTimeout(() => {
      end(...withValues3('histogram'))
      resolve()
    }, 200))
  }

  summaryObserve() { this.summary.observe(...withValues('summary')) }
  summaryReset() { this.summary.reset(...withValues2('summary')) }
  summaryStartTimer() {
    const end = this.summary.startTimer(...withValues2('summary'))
    return new Promise(resolve => setTimeout(() => {
      end(...withValues3('summary'))
      resolve()
    }, 200))
  }
}

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/module', function () {
  let harness: TestHarness;

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    harness = await createTestModule({
      adapters: {},
    }, {
      imports: [InjectableMetricsController]
    });
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
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.counterInc();

      expect(controller.counterInc).to.have.been.called();
      expect(controller.counterInc).to.have.been.calledWith(...withValues('counter'));
    });

    it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.counterIncNoData();

      expect(controller.counterIncNoData).to.have.been.called();
      expect(controller.counterIncNoData).to.have.been.calledWith(1);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });

  });

  describe('Gauge', () => {

    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.gaugeDec();

      expect(controller.gaugeDec).to.have.been.called();
      expect(controller.gaugeDec).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.dec(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.gaugeDecNoData();

      expect(controller.gaugeDecNoData).to.have.been.called();
      expect(controller.gaugeDecNoData).to.have.been.calledWith(1);
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.gaugeInc();

      expect(controller.gaugeInc).to.have.been.called();
      expect(controller.gaugeInc).to.have.been.calledWith(...withValues('gauge'));
    });

    it(`Gauge.inc(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.gaugeIncNoData();

      expect(controller.gaugeIncNoData).to.have.been.called();
      expect(controller.gaugeIncNoData).to.have.been.calledWith(1);
    });

    it(`Gauge.set(${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
      const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
      controller.gaugeSet();

      expect(controller.gaugeSet).to.have.been.called();
      expect(controller.gaugeSet).to.have.been.calledWith(...withValues('gauge'));
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });

  });

  // describe('Histogram', () => {

  //   it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
  //     const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
  //     controller.counterInc();

  //     expect(controller.counterInc).to.have.been.called();
  //     expect(controller.counterInc).to.have.been.calledWith(...withValues('counter'));
  //   });

  //   it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
  //     const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
  //     controller.counterIncNoData();

  //     expect(controller.counterInc).to.have.been.called();
  //     expect(controller.counterInc).to.have.been.calledWith(1);
  //   });

  // });

  // describe('Summary', () => {

  //   it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
  //     const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
  //     controller.counterInc();

  //     expect(controller.counterInc).to.have.been.called();
  //     expect(controller.counterInc).to.have.been.calledWith(...withValues('counter'));
  //   });

  //   it(`Counter.inc(${JSON.stringify(withValues('counter'))}) should be called with proper values`, async () => {
  //     const controller = harness.app.get<InjectableMetricsController>(InjectableMetricsController)
  //     controller.counterIncNoData();

  //     expect(controller.counterInc).to.have.been.called();
  //     expect(controller.counterInc).to.have.been.calledWith(1);
  //   });

  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
