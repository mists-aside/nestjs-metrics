import {Controller} from '@nestjs/common';

import {Tags} from '../../src/adapter/interfaces';
import {EventDecrement, EventDuration, EventIncrement} from '../../src/decorators';
import {Counter, Gauge, Histogram, Summary} from '../../src/metric';

export const withValues = (prefix = 'counter'): [number?, string?, Tags?] => [1, `${prefix}_label`, {tag: prefix}];
export const withValues2 = (prefix = 'counter'): [string?, Tags?] => [`${prefix}_label`, {tag: prefix}];
export const withValues3 = (prefix = 'counter'): [Tags?] => [{tag: prefix}];

/* eslint-disable @typescript-eslint/no-empty-function */

@Controller()
export class InjectableMetricsController {
  constructor(public counter: Counter, public gauge: Gauge, public histogram: Histogram, public summary: Summary) {}

  counterInc(): void {
    this.counter.inc(...withValues('counter'), 'counter');
  }

  counterIncNoData(): void {
    this.counter.inc();
  }

  gaugeDec(): void {
    this.gauge.dec(...withValues('gauge'), 'gauge');
  }

  gaugeDecNoData(): void {
    this.gauge.dec();
  }

  gaugeInc(): void {
    this.gauge.inc(...withValues('gauge'), 'gauge');
  }

  gaugeIncNoData(): void {
    this.gauge.inc();
  }

  gaugeSet(): void {
    this.gauge.set(...withValues('gauge'), 'gauge');
  }

  gaugeStartTimer(): void {
    this.gauge.startTimer(...withValues2('gauge'), 'gauge');
  }

  histogramObserve(): void {
    this.histogram.observe(...withValues('histogram'), 'histogram');
  }

  histogramReset(): void {
    this.histogram.reset(...withValues2('histogram'), 'histogram');
  }

  histogramStartTimer(): Promise<void> {
    const ends = this.histogram.startTimer(...withValues2('histogram'), 'histogram');
    return new Promise((resolve) =>
      setTimeout(() => {
        ends.forEach((end) => end(...withValues3('histogram')));
        resolve();
      }, 200),
    );
  }

  summaryObserve(): void {
    this.summary.observe(...withValues('summary'), 'summary');
  }

  summaryReset(): void {
    this.summary.reset(...withValues2('summary'), 'summary');
  }

  summaryStartTimer(): Promise<void> {
    const ends = this.summary.startTimer(...withValues2('summary'), 'summary');
    return new Promise((resolve) =>
      setTimeout(() => {
        ends.forEach((end) => end(...withValues3('summary')));
        resolve();
      }, 200),
    );
  }
}

@Controller()
export class DecoratedMetricsController {
  @EventIncrement(...withValues('counter'), 'counter')
  triggerCounterIncByAdapterName(): void {}

  @EventIncrement(...withValues('counter'), null, Counter)
  triggerCounterIncByCounterMetric(): void {}

  @EventIncrement(...withValues('gauge'), null, Gauge)
  triggerGaugeIncByGaugeMetric(): void {}

  @EventIncrement(...withValues('all_inc'))
  triggerIncByOnAllIncMetrics(): void {}

  @EventDecrement(...withValues('gauge'), 'gauge')
  triggerGaugeDecByAdapterName(): void {}

  @EventDecrement(...withValues('gauge'))
  triggerDecOnAllGaugeMetrics(): void {}

  @EventDuration(...withValues2('gauge'), 'gauge')
  triggerDurationByAdapterName(): void {}

  @EventDuration(...withValues2('gauge'), 'gauge')
  asyncTriggerDurationByAdapterName(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  @EventDuration(...withValues2('gauge'), 'gauge')
  asyncFailTriggerDurationByAdapterName(): Promise<void> {
    return new Promise((resolve, reject) => setTimeout(() => reject('error'), 100));
  }

  @EventDuration(...withValues2('gauge'), null, Gauge)
  triggerDurationByGaugeMetrics(): void {}

  @EventDuration(...withValues2('histogram'), null, Histogram)
  triggerDurationByHistogramMetrics(): void {}

  @EventDuration(...withValues2('summary'), null, Summary)
  triggerDurationBySummaryMetrics(): void {}

  @EventDuration(...withValues2('summary'), null, Summary)
  asyncTriggerDurationBySummaryMetrics(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  @EventDuration(...withValues2('multi_duration'), null, [Histogram, Summary])
  triggerDurationByMultipleMetrics(): void {}

  @EventDuration(...withValues2('all_duration'))
  triggerDurationByAllMetrics(): void {}
}

/* eslint-enable @typescript-eslint/no-empty-function */
