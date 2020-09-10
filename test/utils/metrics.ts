import * as request from 'supertest';

import {Controller} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Metrics, StatsModule, MetricOptions} from '../../src';
import {Counter, InjectMetric, generateDecorator, incrementWrapper} from '../../src';
import {TestHarness} from './harness';

export const genericOptions = {
  prometheus: {
    labelNames: ['label1', 'label2'],
  },
};

const Increment = generateDecorator(Metrics.Counter, 'metrics_counter_decorator', incrementWrapper, genericOptions);
// const GaugeIncrement = generateDecorator(Metrics.Gauge, gaugeIncrementWrapper, genericOptions);
// const GaugeDecrement = generateDecorator(Metrics.Gauge, gaugeDecrementWrapper, genericOptions);
// const Gauge = generateDecorator(Metrics.Gauge, gaugeSetWrapper, genericOptions);
// const GaugeTiming = generateDecorator(Metrics.Gauge, timingWrapper, genericOptions);
// const HistogramObserve = generateDecorator(Metrics.Histogram, observeWrapper, genericOptions);
// const HistogramTiming = generateDecorator(Metrics.Histogram, timingWrapper, genericOptions);
// const SummaryObserve = generateDecorator(Metrics.Summary, observeWrapper, genericOptions);
// const SummaryTiming = generateDecorator(Metrics.Summary, timingWrapper, genericOptions);

export const testTags = {label1: 'test', label2: 'test'};

@Controller()
export class MetricsController {
  constructor(@InjectMetric('metrics_injector') protected counter: Counter) {}

  public testCustomInjector(): string {
    this.counter.inc();
    return 'metrics_injector';
  }

  @Increment(1, testTags)
  public testIncrementDecorator(): string {
    return 'test_increment_decorator';
  }

  @Increment(10, testTags)
  public testIncrementDecoratorWithValue(): string {
    return 'test_increment_decorator_with_value';
  }

  // @Gauge(testTags, 10)
  // public testGaugeDecorator(): string {
  //   return 'test_gauge_decorator';
  // }

  // @GaugeIncrement(testTags)
  // public testGaugeIncrementDecorator(): string {
  //   return 'test_increment_decorator';
  // }

  // @GaugeIncrement(testTags, 10)
  // public testGaugeIncrementDecoratorWithValue(): string {
  //   return 'test_increment_decorator_with_value';
  // }

  // @GaugeDecrement(testTags)
  // public testGaugeDecrementDecorator(): string {
  //   return 'test_increment_decorator';
  // }

  // @GaugeDecrement(testTags, 10)
  // public testGaugeDecrementDecoratorWithValue(): string {
  //   return 'test_increment_decorator_with_value';
  // }

  // @GaugeTiming(testTags)
  // public testGaugeTimingDecorator(): string {
  //   return 'test_timing_decorator';
  // }

  // @HistogramObserve(testTags, 10)
  // public testHistogramObserveDecorator(): string {
  //   return 'test_histogram_observe_decorator';
  // }

  // @HistogramTiming(testTags)
  // public testHistogramTimingDecorator(): string {
  //   return 'test_histogram_timing_decorator';
  // }

  // @SummaryObserve(testTags, 10)
  // public testSummaryObserveDecorator(): string {
  //   return 'test_summary_observe_decorator';
  // }

  // @SummaryTiming(testTags)
  // public testSummaryTimingDecorator(): string {
  //   return 'test_summary_timing_decorator';
  // }
}
