import {Controller} from '@nestjs/common';

import {
  Counter,
  generateMetricDecorator,
  metricIncrementWrapper,
  metricGaugeIncrementWrapper,
  metricGaugeDecrementWrapper,
  metricGaugeSetWrapper,
  metricObserveWrapper,
  metricTimingWrapper,
  InjectMetric,
  Metrics,
} from '../../src';

export const genericOptions = {
  prometheus: {
    labelNames: ['label1', 'label2'],
  },
};

const Increment = generateMetricDecorator(
  Metrics.Counter,
  'metrics_counter_decorator',
  metricIncrementWrapper,
  genericOptions,
);
const GaugeIncrement = generateMetricDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  metricGaugeIncrementWrapper,
  genericOptions,
);
const GaugeDecrement = generateMetricDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  metricGaugeDecrementWrapper,
  genericOptions,
);
const Gauge = generateMetricDecorator(Metrics.Gauge, 'metrics_gauge_decorator', metricGaugeSetWrapper, genericOptions);
const GaugeTiming = generateMetricDecorator(
  Metrics.Gauge,
  'metrics_gauge_decorator',
  metricTimingWrapper,
  genericOptions,
);
const HistogramObserve = generateMetricDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  metricObserveWrapper,
  genericOptions,
);
const HistogramTiming = generateMetricDecorator(
  Metrics.Histogram,
  'metrics_histogram_decorator',
  metricTimingWrapper,
  genericOptions,
);
const SummaryObserve = generateMetricDecorator(
  Metrics.Summary,
  'metrics_summary_decorator',
  metricObserveWrapper,
  genericOptions,
);
const SummaryTiming = generateMetricDecorator(
  Metrics.Summary,
  'metrics_summary_decorator',
  metricTimingWrapper,
  genericOptions,
);

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
