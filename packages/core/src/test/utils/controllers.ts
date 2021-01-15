import {Controller} from '@nestjs/common';

import {Tags} from '../../adapter/interfaces';
import {EventDecrement, EventDuration, EventIncrement} from '../../decorators';
import {Counter, Gauge, Histogram, Summary} from '../../metric';

export type DataValueLabelTagsAdapter = [number?, string?, Tags?, string?];
type DataValue = [number?];
type DataTags = [Tags?];

export type DataLabelTagsAdapter = [string?, Tags?, string?];

export const withValues = (prefix = 'counter'): [number?, string?, Tags?] => [1, `${prefix}_label`, {tag: prefix}];

export const withValues2 = (prefix = 'counter'): [string?, Tags?] => [`${prefix}_label`, {tag: prefix}];

export const withValues3 = (prefix = 'counter'): [Tags?] => [{tag: prefix}];

export const withIncValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => [
  ...withValues(prefix),
  adapter,
];

export const withIncNoAdapterValues = (prefix: string): DataValueLabelTagsAdapter => [
  ...withIncValues(prefix, undefined),
];

export const withIncNoTagsValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => {
  const values = withIncValues(prefix, adapter);
  values[2] = undefined;
  return values;
};

export const withIncNoTagsNoLabelValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => [
  ...(withIncValues(adapter, prefix).slice(0, 1) as DataValue),
  undefined,
  undefined,
  prefix,
];

export const withDecValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => [
  ...withValues(prefix),
  adapter,
];

export const withSetValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => [
  ...withValues(prefix),
  adapter,
];

export const withStartTimerValues = (prefix: string, adapter: string): DataLabelTagsAdapter => [
  ...withValues2(prefix),
  adapter,
];

export const withEndTimerValues = (prefix: string): DataTags => [...withValues3(prefix)];

export const withObserveValues = (prefix: string, adapter: string): DataValueLabelTagsAdapter => [
  ...withValues(prefix),
  adapter,
];

export const withResetValues = (prefix: string, adapter: string): DataLabelTagsAdapter => [
  ...withValues2(prefix),
  adapter,
];

/* eslint-disable @typescript-eslint/no-empty-function */

@Controller()
export class InjectableMetricsController {
  constructor(public counter: Counter, public gauge: Gauge, public histogram: Histogram, public summary: Summary) {}

  counterInc(): void {
    this.counter.inc(...withIncValues('counter', 'counter'));
  }

  counterIncNoAdapter(): void {
    this.counter.inc(...withIncNoAdapterValues('counter'));
  }

  counterIncNoTags(): void {
    this.counter.inc(...withIncNoTagsValues('counter', 'counter'));
  }

  counterIncNoTagsAndLabel(): void {
    this.counter.inc(...withIncNoTagsNoLabelValues('counter', 'counter'));
  }

  counterIncNoData(): void {
    this.counter.inc();
  }

  gaugeDec(): void {
    this.gauge.dec(...withDecValues('gauge', 'gauge'));
  }

  gaugeDecNoData(): void {
    this.gauge.dec();
  }

  gaugeInc(): void {
    this.gauge.inc(...withIncValues('gauge', 'gauge'));
  }

  gaugeIncNoAdapter(): void {
    this.counter.inc(...withIncNoAdapterValues('gauge'));
  }

  gaugeIncNoTags(): void {
    this.gauge.inc(...withIncNoTagsValues('gauge', 'gauge'));
  }

  gaugeIncNoTagsAndLabel(): void {
    this.gauge.inc(...withIncNoTagsNoLabelValues('gauge', 'gauge'));
  }

  gaugeIncNoData(): void {
    this.gauge.inc();
  }

  gaugeSet(): void {
    this.gauge.set(...withSetValues('gauge', 'gauge'));
  }

  gaugeStartTimer(): void {
    this.gauge.startTimer(...withStartTimerValues('gauge', 'gauge'));
  }

  histogramObserve(): void {
    this.histogram.observe(...withObserveValues('histogram', 'histogram'));
  }

  histogramReset(): void {
    this.histogram.reset(...withResetValues('histogram', 'histogram'));
  }

  histogramStartTimer(): Promise<void> {
    const ends = this.histogram.startTimer(...withStartTimerValues('histogram', 'histogram'));
    return new Promise((resolve) =>
      setTimeout(() => {
        ends.forEach((end) => end(...withEndTimerValues('histogram')));
        resolve();
      }, 200),
    );
  }

  summaryObserve(): void {
    this.summary.observe(...withObserveValues('summary', 'summary'));
  }

  summaryReset(): void {
    this.summary.reset(...withResetValues('summary', 'summary'));
  }

  summaryStartTimer(): Promise<void> {
    const ends = this.summary.startTimer(...withStartTimerValues('summary', 'summary'));
    return new Promise((resolve) =>
      setTimeout(() => {
        ends.forEach((end) => end(...withEndTimerValues('summary')));
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
