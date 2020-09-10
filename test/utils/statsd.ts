import * as StatsdClient from 'statsd-client';

import {Controller} from '@nestjs/common';
import {
  generateDecorator,
  incrementWrapper,
  InjectMetric,
  gaugeWrapper,
  gaugeDeltaWrapper,
  histogramWrapper,
  timingWrapper,
} from '../../src/statsd';

const Increment = generateDecorator(incrementWrapper, 'dummy');
const GaugeDelta = generateDecorator(gaugeDeltaWrapper, 'dummy');
const Gauge = generateDecorator(gaugeWrapper, 'dummy');
const Histogram = generateDecorator(histogramWrapper, 'dummy');
const Timing = generateDecorator(timingWrapper, 'dummy');

@Controller()
export class CustomInjectorController {
  constructor(@InjectMetric('statsd_custom_injector') protected statsd: StatsdClient) {}

  public testStatsdCustomInjector(): string {
    this.statsd.increment('statsd.custom.injector', 10);
    return 'statsd_custom_injector';
  }

  @Increment('test.increment.decorator')
  public testIncrementDecorator(): string {
    return 'test_increment_decorator';
  }

  @Increment('test.increment.decorator.custom.value', 10)
  public testIncrementDecoratorWithCustomValue(): string {
    return 'test_increment_decorator_custom_value';
  }

  @Increment('test.increment.decorator.custom.value.and.tags', 10, {test: 'test'})
  public testIncrementDecoratorWithCustomValueAndTags(): string {
    return 'test_increment_decorator_custom_value';
  }

  @Gauge('test.gauge.decorator', 10)
  public testGaugeDecorator(): string {
    return 'test_gauge_decorator';
  }

  @Gauge('test.gauge.decorator.with.tags', 10, {test: 'test'})
  public testGaugeDecoratorWithTags(): string {
    return 'test_gauge_decorator_with_tags';
  }

  @GaugeDelta('test.gauge.delta.decorator', 10)
  public testGaugeDeltaDecorator(): string {
    return 'test_gauge_delta_decorator';
  }

  @GaugeDelta('test.gauge.delta.decorator.with.tags', 10, {test: 'test'})
  public testGaugeDeltaDecoratorWithTags(): string {
    return 'test_gauge_delta_decorator_with_tags';
  }

  @Histogram('test.histogram.decorator', 10)
  public testHistogramDecorator(): string {
    return 'test_histogram_decorator';
  }

  @Histogram('test.histogram.decorator.with.tags', 10, {test: 'test'})
  public testHistogramDecoratorWithTags(): string {
    return 'test_histogram_decorator_with_tags';
  }

  @Timing('test.timing.decorator')
  public testTimingDecorator(): string {
    return 'test_timing_decorator';
  }

  @Timing('test.timing.decorator.with.tags', {test: 'test'})
  public testTimingDecoratorWithTags(): string {
    return 'test_timing_decorator_with_tags';
  }

  @Timing('test.timing.decorator')
  public async testAsyncTimingDecorator(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 'test_timing_decorator';
  }

  @Timing('test.timing.decorator.with.tags', {test: 'test'})
  public async testAsyncTimingDecoratorWithTags(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 'test_timing_decorator_with_tags';
  }
}

@Controller()
export class StatsdController {
  constructor(@InjectMetric('statsd_injector') protected statsd: StatsdClient) {}

  public testStatsdInjector(): string {
    this.statsd.increment('statsd.injector', 10);
    return 'statsd_injector';
  }
}
