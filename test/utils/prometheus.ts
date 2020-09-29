import * as PromClient from 'prom-client';
import * as request from 'supertest';

import {Controller} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Metrics, MetricsModule} from '../../src';
import {
  gaugeDecrementWrapper,
  gaugeIncrementWrapper,
  gaugeSetWrapper,
  generateDecorator,
  incrementWrapper,
  InjectPrometheusMetric,
  makePrometheusProvider,
  observeWrapper,
  timingWrapper,
} from '../../src/prometheus';
import {TestHarness} from './harness';
import {PrometheusOptions} from 'src/prometheus/options';

export const genericOptions = {
  help: 'prometheus_generic',
  labelNames: ['label1', 'label2'],
  name: 'prometheus_generic',
};

const Increment = generateDecorator(Metrics.Counter, incrementWrapper, genericOptions);
const GaugeIncrement = generateDecorator(Metrics.Gauge, gaugeIncrementWrapper, genericOptions);
const GaugeDecrement = generateDecorator(Metrics.Gauge, gaugeDecrementWrapper, genericOptions);
const Gauge = generateDecorator(Metrics.Gauge, gaugeSetWrapper, genericOptions);
const GaugeTiming = generateDecorator(Metrics.Gauge, timingWrapper, genericOptions);
const HistogramObserve = generateDecorator(Metrics.Histogram, observeWrapper, genericOptions);
const HistogramTiming = generateDecorator(Metrics.Histogram, timingWrapper, genericOptions);
const SummaryObserve = generateDecorator(Metrics.Summary, observeWrapper, genericOptions);
const SummaryTiming = generateDecorator(Metrics.Summary, timingWrapper, genericOptions);

export const testTags = {label1: 'test', label2: 'test'};

@Controller()
export class PrometheusController {
  constructor(@InjectPrometheusMetric('prometheus_injector') protected counter: PromClient.Counter<string>) {}

  public testPrometheusCustomInjector(): string {
    this.counter.inc();
    return 'prometheus_injector';
  }

  @Increment(testTags)
  public testIncrementDecorator(): string {
    return 'test_increment_decorator';
  }

  @Increment(testTags, 10)
  public testIncrementDecoratorWithValue(): string {
    return 'test_increment_decorator_with_value';
  }

  @Gauge(testTags, 10)
  public testGaugeDecorator(): string {
    return 'test_gauge_decorator';
  }

  @GaugeIncrement(testTags)
  public testGaugeIncrementDecorator(): string {
    return 'test_increment_decorator';
  }

  @GaugeIncrement(testTags, 10)
  public testGaugeIncrementDecoratorWithValue(): string {
    return 'test_increment_decorator_with_value';
  }

  @GaugeDecrement(testTags)
  public testGaugeDecrementDecorator(): string {
    return 'test_increment_decorator';
  }

  @GaugeDecrement(testTags, 10)
  public testGaugeDecrementDecoratorWithValue(): string {
    return 'test_increment_decorator_with_value';
  }

  @GaugeTiming(testTags)
  public testGaugeTimingDecorator(): string {
    return 'test_timing_decorator';
  }

  @HistogramObserve(testTags, 10)
  public testHistogramObserveDecorator(): string {
    return 'test_histogram_observe_decorator';
  }

  @HistogramTiming(testTags)
  public testHistogramTimingDecorator(): string {
    return 'test_histogram_timing_decorator';
  }

  @SummaryObserve(testTags, 10)
  public testSummaryObserveDecorator(): string {
    return 'test_summary_observe_decorator';
  }

  @SummaryTiming(testTags)
  public testSummaryTimingDecorator(): string {
    return 'test_summary_timing_decorator';
  }
}

export async function createTestModule(options?: PrometheusOptions): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    controllers: [PrometheusController],
    imports: [
      MetricsModule.register(
        options
          ? {
              prometheus: options,
            }
          : {},
      ),
    ],
    providers: [makePrometheusProvider(Metrics.Counter, {name: 'prometheus_injector', help: 'prometheus_injector'})],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}
