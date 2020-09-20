import {Controller} from '@nestjs/common';

import {
  Counter,
  generateDecorator,
  incrementWrapper,
  gaugeIncrementWrapper,
  gaugeDecrementWrapper,
  gaugeSetWrapper,
  observeWrapper,
  timingWrapper,
  InjectMetric,
  Metrics,
} from '../../src';

export const genericOptions = {
  prometheus: {
    labelNames: ['label1', 'label2'],
  },
};

const Increment = generateDecorator(Metrics.Counter, 'metrics_counter_decorator', incrementWrapper, genericOptions);
const GaugeIncrement = generateDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  gaugeIncrementWrapper,
  genericOptions,
);
const GaugeDecrement = generateDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  gaugeDecrementWrapper,
  genericOptions,
);
const Gauge = generateDecorator(Metrics.Gauge, 'metrics_gauge_decorator', gaugeSetWrapper, genericOptions);
const GaugeTiming = generateDecorator(Metrics.Gauge, 'metrics_gauge_decorator', timingWrapper, genericOptions);
const HistogramObserve = generateDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  observeWrapper,
  genericOptions,
);
const HistogramTiming = generateDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  timingWrapper,
  genericOptions,
);
const SummaryObserve = generateDecorator(Metrics.Summary, 'metrics_summary_decorator', observeWrapper, genericOptions);
const SummaryTiming = generateDecorator(Metrics.Summary, 'metrics_summary_decorator', timingWrapper, genericOptions);

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

  @Gauge(10, testTags)
  public testGaugeDecorator(): string {
    return 'test_gauge_decorator';
  }

  @GaugeIncrement()
  public testGaugeIncrementDecorator(): string {
    return 'test_gauge_increment_decorator';
  }

  @GaugeIncrement(10, testTags)
  public testGaugeIncrementDecoratorWithValue(): string {
    return 'test_gauge_increment_decorator_with_value';
  }

  @GaugeDecrement()
  public testGaugeDecrementDecorator(): string {
    return 'test_gauge_decrement_decorator';
  }

  @GaugeDecrement(10, testTags)
  public testGaugeDecrementDecoratorWithValue(): string {
    return 'test_gauge_decrement_decorator_with_value';
  }

  @GaugeTiming(testTags)
  public testGaugeTimingDecorator(): string {
    return 'test_gauge_timing_decorator';
  }

  @HistogramObserve(10, testTags)
  public testHistogramObserveDecorator(): string {
    return 'test_histogram_observe_decorator';
  }

  @HistogramTiming(testTags)
  public testHistogramTimingDecorator(): string {
    return 'test_histogram_timing_decorator';
  }

  @SummaryObserve(10, testTags)
  public testSummaryObserveDecorator(): string {
    return 'test_summary_observe_decorator';
  }

  @SummaryTiming(testTags)
  public testSummaryTimingDecorator(): string {
    return 'test_summary_timing_decorator';
  }
}
