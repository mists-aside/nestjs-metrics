import {Controller} from '@nestjs/common';

import {Tags} from '../../adapter/interfaces';
import {EventDecrement, EventDuration, EventIncrement} from '../../decorators';
import {Counter, Gauge, Histogram, IncOptions, Summary} from '../../metric';

export type DataValueLabelTagsAdapter = [number?, string?, Tags?, string?];
type DataValue = [number?];
type DataTags = [Tags?];

export type DataLabelTagsAdapter = [string?, Tags?, string?];

export const incValues: IncOptions = {};

export const incValuesDelta: IncOptions = {
  delta: 1,
};

export const incValuesDeltaLabel: IncOptions = {
  ...incValuesDelta,
  label: 'label_counter',
};

export const incValuesDeltaLabelTags: IncOptions = {
  ...incValuesDeltaLabel,
  tags: {tag: 'counter'},
};

export const incValuesDeltaLabelTagsAdapter: IncOptions = {
  ...incValuesDeltaLabelTags,
  adapter: 'counter',
};

export const decValues: IncOptions = {};

export const decValuesDelta: IncOptions = {
  delta: 1,
};

export const decValuesDeltaLabel: IncOptions = {
  ...decValuesDelta,
  label: 'label_counter',
};

export const decValuesDeltaLabelTags: IncOptions = {
  ...decValuesDeltaLabel,
  tags: {tag: 'counter'},
};

export const decValuesDeltaLabelTagsAdapter: IncOptions = {
  ...decValuesDeltaLabelTags,
  adapter: 'counter',
};

/* eslint-disable @typescript-eslint/no-empty-function */

@Controller()
export class InjectableMetricsController {
  constructor(public counter: Counter, public gauge: Gauge, public histogram: Histogram, public summary: Summary) {}

  counterInc(): void {
    this.counter.inc();
  }

  counterIncClone(): void {
    this.counter.inc(incValues);
  }

  // counterIncDelta(): void {
  //   this.counter.inc(incValuesDelta);
  // }

  // counterIncDeltaLabel(): void {
  //   this.counter.inc(incValuesDeltaLabel);
  // }

  // counterIncDeltaLabelTags(): void {
  //   this.counter.inc(incValuesDeltaLabelTags);
  // }

  // counterIncDeltaLabelTagsAdapter(): void {
  //   this.counter.inc(incValuesDeltaLabelTagsAdapter);
  // }

  gaugeDec(): void {
    this.gauge.dec();
  }

  gaugeDecClone(): void {
    this.gauge.dec(decValues);
  }

  // gaugeDecNoData(): void {
  //   this.gauge.dec();
  // }

  // gaugeInc(): void {
  //   this.gauge.inc(...withIncValues('gauge', 'gauge'));
  // }

  // gaugeIncNoAdapter(): void {
  //   this.counter.inc(...withIncNoAdapterValues('gauge'));
  // }

  // gaugeIncNoTags(): void {
  //   this.gauge.inc(...withIncNoTagsValues('gauge', 'gauge'));
  // }

  // gaugeIncNoTagsAndLabel(): void {
  //   this.gauge.inc(...withIncNoTagsNoLabelValues('gauge', 'gauge'));
  // }

  // gaugeIncNoData(): void {
  //   this.gauge.inc();
  // }

  // gaugeSet(): void {
  //   this.gauge.set(...withSetValues('gauge', 'gauge'));
  // }

  // gaugeStartTimer(): void {
  //   this.gauge.startTimer(...withStartTimerValues('gauge', 'gauge'));
  // }

  // histogramObserve(): void {
  //   this.histogram.observe(...withObserveValues('histogram', 'histogram'));
  // }

  // histogramReset(): void {
  //   this.histogram.reset(...withResetValues('histogram', 'histogram'));
  // }

  // histogramStartTimer(): Promise<void> {
  //   const ends = this.histogram.startTimer(...withStartTimerValues('histogram', 'histogram'));
  //   return new Promise((resolve) =>
  //     setTimeout(() => {
  //       ends.forEach((end) => end(...withEndTimerValues('histogram')));
  //       resolve();
  //     }, 200),
  //   );
  // }

  // summaryObserve(): void {
  //   this.summary.observe(...withObserveValues('summary', 'summary'));
  // }

  // summaryReset(): void {
  //   this.summary.reset(...withResetValues('summary', 'summary'));
  // }

  // summaryStartTimer(): Promise<void> {
  //   const ends = this.summary.startTimer(...withStartTimerValues('summary', 'summary'));
  //   return new Promise((resolve) =>
  //     setTimeout(() => {
  //       ends.forEach((end) => end(...withEndTimerValues('summary')));
  //       resolve();
  //     }, 200),
  //   );
  // }
}

@Controller()
export class DecoratedMetricsController {
  // @EventIncrement(...withIncValues('counter', 'counter'))
  // counterIncNoMetric(): void {}

  // @EventIncrement(...withValues('counter'), undefined, Counter)
  // counterIncNoAdapterWithMetric(): void {}

  // @EventIncrement(...withValues('gauge'), undefined, Gauge)
  // gaugeIncNoAdapterWithMetric(): void {}

  // @EventIncrement(...withValues('all_inc'))
  // incAllNoAdapterNoMetric(): void {}

  // @EventDecrement(...withValues('gauge'), 'gauge')
  // gaugeDecNoMetric(): void {}

  // @EventDecrement(...withValues('gauge'))
  // gaugeDecNoAdapterNoMetric(): void {}

  // @EventDuration(...withValues2('gauge'), 'gauge')
  // durationByAdapterName(): void {}

  // @EventDuration(...withValues2('gauge'), 'gauge')
  // asyncDurationByAdapterName(): Promise<void> {
  //   return new Promise((resolve) => setTimeout(resolve, 100));
  // }

  // @EventDuration(...withValues2('gauge'), 'gauge')
  // asyncFailDurationByAdapterName(): Promise<void> {
  //   return new Promise((resolve, reject) => setTimeout(() => reject('error'), 100));
  // }

  // @EventDuration(...withValues2('gauge'), null, Gauge)
  // durationNoAdapterWithGauge(): void {}

  // @EventDuration(...withValues2('histogram'), null, Histogram)
  // durationNoAdapterWithHistogram(): void {}

  // @EventDuration(...withValues2('summary'), null, Summary)
  // durationNoAdapterWithSummary(): void {}

  // @EventDuration(...withValues2('summary'), null, Summary)
  // asyncTriggerDurationBySummaryMetrics(): Promise<void> {
  //   return new Promise((resolve) => setTimeout(resolve, 100));
  // }

  // @EventDuration(...withValues2('multi_duration'), null, [Histogram, Summary])
  // durationNoAdapterWithMultipleMetrics(): void {}

  // @EventDuration(...withValues2('all_duration'))
  // durationNoAdapterNoMetrics(): void {}
}

/* eslint-enable @typescript-eslint/no-empty-function */