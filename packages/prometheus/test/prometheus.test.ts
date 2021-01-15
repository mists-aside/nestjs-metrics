import {ErrorMessages} from './../src/errors';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as prometheus from 'prom-client';

import {
  Counter as CounterMetric,
  Gauge as GaugeMetric,
  Histogram as HistogramMetric,
  MetricsAdapters,
  Summary as SummaryMetric,
  Tags,
  TimerMethod,
} from '@mists/nestjs-metrics';
import {
  createTestModule,
  InjectableMetricsController,
  TestHarness,
  withValues,
  withValues2,
  withValues3,
  withValuesNoTags,
} from '@mists/nestjs-metrics/dist/commonjs/test/utils';

import {Counter, Gauge, Histogram, Summary} from '../src';

chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests,mocha/no-mocha-arrows
describe('src/adapter', function () {
  let adapters: MetricsAdapters;
  let controller: InjectableMetricsController;
  let harness: TestHarness;
  let sandbox: sinon.SinonSandbox;
  // eslint-disable-next-line mocha/no-setup-in-describe
  const endTimer = sinon.fake();

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    adapters = {
      counter: new Counter(['tag']),
      counter2: new Counter(['tag']),
      gauge: new Gauge(['tag']),
      histogram: new Histogram(['tag']),
      summary: new Summary(['tag']),
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

    let value: number;
    let label: string;
    let tags: Tags;

    [value, label, tags] = withValues('counter');
    sandbox.spy(adapters.counter.getCounter(label), 'inc');

    [value, label, tags] = withValues('gauge');
    sandbox.spy(adapters.gauge.getGauge(label), 'dec');
    sandbox.spy(adapters.gauge.getGauge(label), 'inc');
    sandbox.spy(adapters.gauge.getGauge(label), 'set');
    sandbox.spy(adapters.gauge.getGauge(label), 'startTimer');

    [value, label, tags] = withValues('histogram');
    sandbox.spy(adapters.histogram.getHistogram(label), 'observe');
    sandbox.spy(adapters.histogram.getHistogram(label), 'reset');
    sandbox.spy(adapters.histogram.getHistogram(label), 'startTimer');

    [value, label, tags] = withValues('summary');
    sandbox.spy(adapters.summary.getSummary(label), 'observe');
    sandbox.spy(adapters.summary.getSummary(label), 'reset');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adapters.summary.getSummary(label).startTimer = (tags?: Tags): TimerMethod => endTimer as TimerMethod;
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  afterEach(async () => {
    if (harness) {
      await harness.app.close();
      harness = undefined;
    }

    sandbox.restore();
    prometheus.register.clear();
  });

  describe('Counter', () => {
    it(`adapters.counter.getCounter to be an object`, async () => {
      const [, label] = withValues('counter');
      expect(adapters.counter.getCounter(label)).to.be.an('object');
    });

    it(`adapters.counter.getCounter to be an object (repeated)`, async () => {
      const [, label] = withValues('counter');
      expect(adapters.counter.getCounter(label)).to.be.an('object');
    });

    it(`Counter.inc(...${JSON.stringify()}, 'counter') should be called with proper values`, async () => {
      controller.counterInc();

      const [value, label, tags] = withValues('counter');
      expect(adapters.counter.getCounter(label).inc).to.have.been.called;
      expect(adapters.counter.getCounter(label).inc).to.have.been.calledWith(tags, value);
    });

    // it(`Counter.inc(...${JSON.stringify(
    //   withValuesNoTags('counter'),
    // )}) should be called with proper values (no adapter name)`, async () => {
    //   controller.counterIncNoTags();

    //   const [value, label] = withValuesNoTags('counter');
    //   expect(adapters.counter.getCounter(label).inc).to.have.been.called;
    //   expect(adapters.counter.getCounter(label).inc).to.have.been.calledWith(undefined, value);
    // });

    // it(`Counter.inc() should be called`, async () => {
    //   const errorTrigger = () => controller.counterIncNoData();
    //   expect(errorTrigger).to.throw(ErrorMessages.INVALID_LABEL_ERROR);

    //   const [value, label, tags] = withValues('counter');
    //   expect(adapters.counter.getCounter(label).inc).to.not.have.been.called;
    // });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  // describe('Gauge', () => {
  //   it(`adapters.gauge.getGauge to be an object`, async () => {
  //     const [, label] = withValues('gauge');
  //     expect(adapters.gauge.getGauge(label)).to.be.an('object');
  //   });

  //   it(`adapters.gauge.getGauge to be an object (repeated)`, async () => {
  //     const [, label] = withValues('gauge');
  //     expect(adapters.gauge.getGauge(label)).to.be.an('object');
  //   });

  //   it(`Gauge.dec(...${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //     controller.gaugeDec();
  //     const [value, label, tags] = withValues('gauge');

  //     expect(adapters.gauge.getGauge(label).dec).to.have.been.called;
  //     expect(adapters.gauge.getGauge(label).dec).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Gauge.dec() should be called`, async () => {
  //     const errorTrigger = () => controller.gaugeDecNoData();
  //     expect(errorTrigger).to.throw(ErrorMessages.INVALID_LABEL_ERROR);

  //     const [value, label, tags] = withValues('gauge');
  //     expect(adapters.gauge.getGauge(label).dec).to.have.not.been.called;
  //   });

  //   it(`Gauge.inc(...${JSON.stringify(withValues('gauge'))}, 'gauge') should be called with proper values`, async () => {
  //     controller.gaugeInc();
  //     const [value, label, tags] = withValues('gauge');

  //     expect(adapters.gauge.getGauge(label).inc).to.have.been.called;
  //     expect(adapters.gauge.getGauge(label).inc).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Gauge.inc(...${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //     controller.gaugeInc();
  //     const [value, label, tags] = withValues('gauge');

  //     expect(adapters.gauge.getGauge(label).inc).to.have.been.called;
  //     expect(adapters.gauge.getGauge(label).inc).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Gauge.inc() should be called`, async () => {
  //     const errorTrigger = () => controller.gaugeIncNoData();
  //     expect(errorTrigger).to.throw(ErrorMessages.INVALID_LABEL_ERROR);

  //     const [value, label, tags] = withValues('gauge');
  //     expect(adapters.gauge.getGauge(label).inc).to.have.not.been.called;
  //   });

  //   it(`Gauge.set(...${JSON.stringify(withValues('gauge'))}) should be called with proper values`, async () => {
  //     controller.gaugeSet();
  //     const [value, label, tags] = withValues('gauge');

  //     expect(adapters.gauge.getGauge(label).set).to.have.been.called;
  //     expect(adapters.gauge.getGauge(label).set).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Gauge.startTimer(${JSON.stringify(withValues2('gauge'))}) should be called`, async () => {
  //     await controller.gaugeStartTimer();
  //     const [label, tags] = withValues2('gauge');

  //     expect(adapters.gauge.getGauge(label).startTimer).to.have.been.called;
  //     expect(adapters.gauge.getGauge(label).startTimer).to.have.been.calledWith(tags);
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Histogram', () => {
  //   it(`adapters.histogram.getHistogram to be an object`, async () => {
  //     const [, label] = withValues('histogram');
  //     expect(adapters.histogram.getHistogram(label)).to.be.an('object');
  //   });

  //   it(`adapters.histogram.getHistogram to be an object (repeated)`, async () => {
  //     const [, label] = withValues('histogram');
  //     expect(adapters.histogram.getHistogram(label)).to.be.an('object');
  //   });

  //   it(`Histogram.observe(...${JSON.stringify(
  //     withValues('histogram'),
  //   )}) should be called with proper values`, async () => {
  //     controller.histogramObserve();
  //     const [value, label, tags] = withValues('histogram');

  //     expect(adapters.histogram.getHistogram(label).observe).to.have.been.called;
  //     expect(adapters.histogram.getHistogram(label).observe).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Histogram.reset(...${JSON.stringify(withValues2('histogram'))}) should be called`, async () => {
  //     controller.histogramReset();
  //     const [label, tags] = withValues2('histogram');

  //     expect(adapters.histogram.getHistogram(label).reset).to.have.been.called;
  //   });

  //   it(`Histogram.startTimer(...${JSON.stringify(
  //     withValues('histogram'),
  //   )}) should be called with proper values`, async () => {
  //     await controller.histogramStartTimer();
  //     const [label, tags] = withValues2('histogram');

  //     expect(adapters.histogram.getHistogram(label).startTimer).to.have.been.called;
  //     expect(adapters.histogram.getHistogram(label).startTimer).to.have.been.calledWith(tags);
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  // describe('Summary', () => {
  //   it(`Summary.observe(...${JSON.stringify(withValues('summary'))}) should be called with proper values`, async () => {
  //     controller.summaryObserve();
  //     const [value, label, tags] = withValues('summary');

  //     expect(adapters.summary.getSummary(label).observe).to.have.been.called;
  //     expect(adapters.summary.getSummary(label).observe).to.have.been.calledWith(tags, value);
  //   });

  //   it(`Summary.reset(...${JSON.stringify(withValues2('summary'))}) should be called with proper values`, async () => {
  //     controller.summaryReset();
  //     const [label, tags] = withValues2('summary');

  //     expect(adapters.summary.getSummary(label).reset).to.have.been.called;
  //   });

  //   it(`Summary.startTimer(...${JSON.stringify(
  //     withValues2('summary'),
  //   )}) should be called with proper values`, async () => {
  //     await controller.summaryStartTimer();
  //     const [label, tags] = withValues2('summary');

  //     expect(endTimer).to.have.been.called;
  //     expect(endTimer).to.have.been.calledWith(tags);
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
