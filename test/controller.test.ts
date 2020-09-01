/* eslint-disable @typescript-eslint/no-explicit-any */
import {generateStatsdDecorator} from './../src/statsd/decorator';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import * as PromClient from 'prom-client';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as StatsdClient from 'statsd-client';

import {Controller, Logger} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';

import {
  Counter,
  Gauge,
  generateDecorator,
  generatePrometheusDecorator,
  Histogram,
  InjectMetric,
  InjectPrometheusMetric,
  InjectStatsdClient,
  makeMetricProvider,
  makePrometheusProvider,
  Metric,
  Metrics,
  statsdClientProvider,
  Summary,
} from '../src';
import {DummyCounter, DummyGauge, DummyHistogram, DummySummary} from '../src/prometheus/utils';
import {DummyStatsdClient} from '../src/statsd/utils';

chai.use(sinonChai);

const methodWrapper = (target: any, method: (...args: any[]) => any, metric: Metric): ((...args: any[]) => any) => {
  const wrapper = (...args: any[]): any => {
    (metric as Counter).inc();
    return method.call(target, ...args);
  };
  return wrapper;
};

const TestCounterDecorator = generateDecorator(Metrics.Counter, 'counter_metric_decorator', methodWrapper);

const prometheusMethodWrapper = (
  target: any,
  method: (...args: any[]) => any,
  metric: PromClient.Counter<string>,
): ((...args: any[]) => any) => {
  const wrapper = (...args: any[]): any => {
    metric.inc();
    return method.call(target, ...args);
  };
  return wrapper;
};

const TestPrometheusMethodDecorator = generatePrometheusDecorator(Metrics.Counter, prometheusMethodWrapper);

const statsdMethodWrapper = (
  name: string,
  target: any,
  method: (...args: any[]) => any,
  metric: StatsdClient,
): ((...args: any[]) => any) => {
  const wrapper = (...args: any[]): any => {
    metric.increment(name);
    return method.call(target, ...args);
  };
  return wrapper;
};

const TestStatsdMethodDecorator = generateStatsdDecorator(statsdMethodWrapper);

@Controller()
export class TestController {
  constructor(
    @InjectMetric('counter_metric') public counter: Counter,
    @InjectMetric('gauge_metric') public gauge: Gauge,
    @InjectMetric('histogram_metric') public histogram: Histogram,
    @InjectMetric('summary_metric') public summary: Summary,

    @InjectPrometheusMetric('prometheus_counter_metric') public prometheusCounter: PromClient.Counter<string>,
    @InjectPrometheusMetric('prometheus_gauge_metric') public prometheusGauge: PromClient.Gauge<string>,
    @InjectPrometheusMetric('prometheus_histogram_metric') public prometheusHistogram: PromClient.Histogram<string>,
    @InjectPrometheusMetric('prometheus_summary_metric') public prometheusSummary: PromClient.Summary<string>,

    @InjectStatsdClient() public statsd: StatsdClient,
  ) {}

  @TestCounterDecorator()
  testCounterDecorator(): string {
    return 'test_counter_decorator';
  }

  @TestPrometheusMethodDecorator()
  testPrometheusCounterDecorator(): string {
    return 'test_counter_decorator_prometheus';
  }

  @TestStatsdMethodDecorator('test')
  testStatsdCounterDecorator(): string {
    return 'test_counter_decorator_statsd';
  }
}

describe('src/module', () => {
  let controller: TestController;

  // eslint-disable-next-line mocha/no-mocha-arrows
  before(() => {
    DummyStatsdClient.gaugeDelta = sinon.fake();
    DummyStatsdClient.gauge = sinon.fake();
    DummyStatsdClient.histogram = sinon.fake();
    DummyStatsdClient.increment = sinon.fake();
    DummyStatsdClient.timing = sinon.fake();

    DummyCounter.inc = sinon.fake();

    DummyGauge.inc = sinon.fake();
    DummyGauge.dec = sinon.fake();
    DummyGauge.set = sinon.fake();
    DummyGauge.startTimer = sinon.fake.returns(() => {
      return 0;
    });

    DummyHistogram.observe = sinon.fake();
    DummyHistogram.startTimer = sinon.fake.returns(() => {
      return 0;
    });

    DummySummary.observe = sinon.fake();
    DummySummary.startTimer = sinon.fake.returns(() => {
      return 0;
    });
  });

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        Logger,

        makeMetricProvider(Metrics.Counter, 'counter_metric'),
        makeMetricProvider(Metrics.Gauge, 'gauge_metric'),
        makeMetricProvider(Metrics.Histogram, 'histogram_metric'),
        makeMetricProvider(Metrics.Summary, 'summary_metric'),

        makePrometheusProvider(Metrics.Counter, {name: 'prometheus_counter_metric', help: 'prometheus_counter_metric'}),
        makePrometheusProvider(Metrics.Gauge, {name: 'prometheus_gauge_metric', help: 'prometheus_gauge_metric'}),
        makePrometheusProvider(Metrics.Histogram, {
          name: 'prometheus_histogram_metric',
          help: 'prometheus_histogram_metric',
        }),
        makePrometheusProvider(Metrics.Summary, {name: 'prometheus_summary_metric', help: 'prometheus_summary_metric'}),

        statsdClientProvider,
      ],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  it('should be defined', () => {
    chai.expect(controller).to.be.an('object');
    chai.expect(controller).to.be.instanceOf(TestController);
  });

  describe('injecting metrics', () => {
    it('counter is defined as instanceof Counter', () => {
      chai.expect(controller.counter).to.be.an('object');
      chai.expect(controller.counter).to.be.instanceOf(Counter);

      controller.counter.inc();
      chai.expect(DummyCounter.inc).to.have.been.called;
      chai.expect(DummyStatsdClient.increment).to.have.been.called;
    });

    it('gauge is defined as instanceof Gauge', () => {
      chai.expect(controller.gauge).to.be.an('object');
      chai.expect(controller.gauge).to.be.instanceOf(Gauge);

      controller.gauge.inc();
      chai.expect(DummyGauge.inc).to.have.been.called;
      chai.expect(DummyStatsdClient.gaugeDelta).to.have.been.called;

      controller.gauge.dec();
      chai.expect(DummyGauge.dec).to.have.been.called;
      chai.expect(DummyStatsdClient.gaugeDelta).to.have.been.called;

      controller.gauge.set(10);
      chai.expect(DummyGauge.set).to.have.been.called;
      chai.expect(DummyStatsdClient.gauge).to.have.been.called;
    });

    it('histogram is defined as instanceof Histogram', () => {
      chai.expect(controller.histogram).to.be.an('object');
      chai.expect(controller.histogram).to.be.instanceOf(Histogram);

      controller.histogram.observe(10);
      chai.expect(DummyHistogram.observe).to.have.been.called;
      chai.expect(DummyStatsdClient.histogram).to.have.been.called;
    });

    it('summary is defined as instanceof Summary', () => {
      chai.expect(controller.summary).to.be.an('object');
      chai.expect(controller.summary).to.be.instanceOf(Summary);

      controller.summary.observe(10);
      chai.expect(DummySummary.observe).to.have.been.called;
      chai.expect(DummyStatsdClient.histogram).to.have.been.called;
    });
  });

  describe('injecting prometheus', () => {
    it('prometheusCounter.inc() to call dummy functions', () => {
      controller.prometheusCounter.inc();

      chai.expect(DummyCounter.inc).to.have.been.called;
    });

    it('prometheusGauge.inc() to call dummy functions', () => {
      controller.prometheusGauge.inc();

      chai.expect(DummyGauge.inc).to.have.been.called;
    });

    it('prometheusHistogram.observe() to call dummy functions', () => {
      controller.prometheusHistogram.observe(10);

      chai.expect(DummyHistogram.observe).to.have.been.called;
    });

    it('prometheusSummary.observe() to call dummy functions', () => {
      controller.prometheusSummary.observe(10);

      chai.expect(DummySummary.observe).to.have.been.called;
    });
  });

  describe('injecting statsd', () => {
    it('statsd.increment() to call dummy functions', () => {
      controller.statsd.increment('test');

      chai.expect(DummyStatsdClient.increment).to.have.been.called;
    });
  });

  describe('decorator', () => {
    it('TestController.testCounterDecorator() to call dummy functions', () => {
      chai.expect(controller.testCounterDecorator()).to.equal('test_counter_decorator');

      chai.expect(DummyCounter.inc).to.have.been.called;
      chai.expect(DummyStatsdClient.increment).to.have.been.called;
    });

    it('TestController.testPrometheusCounterDecorator() to call dummy functions', () => {
      chai.expect(controller.testPrometheusCounterDecorator()).to.equal('test_counter_decorator_prometheus');

      chai.expect(DummyCounter.inc).to.have.been.called;
    });

    it('TestController.TestStgatsdMethodDecorator() to call dummy functions', () => {
      chai.expect(controller.testStatsdCounterDecorator()).to.equal('test_counter_decorator_statsd');

      chai.expect(DummyStatsdClient.increment).to.have.been.called;
    });
  });
});
