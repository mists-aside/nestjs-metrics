import { Controller } from '@nestjs/common';

import { Tags } from '../../src/adapter/interfaces';
import { EventDecrement, EventDuration, EventIncrement } from '../../src/decorators';
import { Counter, Gauge, Histogram, Summary } from '../../src/metric';

export const withValues = (prefix = 'counter'): [number?, string?, Tags?] => [1, `${prefix}_label`, {tag: prefix}];
export const withValues2 = (prefix = 'counter'): [string?, Tags?] => [`${prefix}_label`, {tag: prefix}];
export const withValues3 = (prefix = 'counter'): [Tags?] => [{tag: prefix}];

@Controller()
export class InjectableMetricsController {
  constructor(public counter: Counter, public gauge: Gauge, public histogram: Histogram, public summary: Summary) {}

  counterInc() {
    this.counter.inc(...withValues('counter'), 'counter');
  }

  counterIncNoData() {
    this.counter.inc();
  }

  gaugeDec() {
    this.gauge.dec(...withValues('gauge'), 'gauge');
  }

  gaugeDecNoData() {
    this.gauge.dec();
  }

  gaugeInc() {
    this.gauge.inc(...withValues('gauge'), 'gauge');
  }

  gaugeIncNoData() {
    this.gauge.inc();
  }

  gaugeSet() {
    this.gauge.set(...withValues('gauge'), 'gauge');
  }

  gaugeStartTimer() {
    this.gauge.startTimer(...withValues2('gauge'), 'gauge');
  }

  histogramObserve() {
    this.histogram.observe(...withValues('histogram'), 'histogram');
  }

  histogramReset() {
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

  summaryObserve() {
    this.summary.observe(...withValues('summary'), 'summary');
  }

  summaryReset() {
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
  triggerCounterIncByAdapterName() {}

  @EventIncrement(...withValues('counter'), null, Counter)
  triggerCounterIncByCounterMetric() {}

  @EventIncrement(...withValues('gauge'), null, Gauge)
  triggerGaugeIncByGaugeMetric() {}

  @EventIncrement(...withValues('all_inc'))
  triggerIncByOnAllIncMetrics() {}

  @EventDecrement(...withValues('gauge'), 'gauge')
  triggerGaugeDecByAdapterName() {}

  @EventDecrement(...withValues('gauge'))
  triggerDecOnAllGaugeMetrics() {}

  //   @EventDuration(...withValues('gauge'), 'gauge')
  //   triggerGaugeTimerByAdapterName() {}

  //   @EventDuration(...withValues('gauge'), null, 'gauge')
  //   triggerGaugeTimerByMetricFilter() {}

  //   @EventDuration(...withValues('histogram'), 'histogram')
  //   triggerHistogramTimerByAdapterName() {}

  //   @EventDuration(...withValues('histogram'), null, 'histogram')
  //   triggerHistogramTimerByMetricFilter() {}

  //   @EventDuration(...withValues('summary'), 'summary')
  //   triggerSummaryTimerByAdapterName() {}

  //   @EventDuration(...withValues('summary'), null, 'summary')
  //   triggerSummaryTimerByMetricFilter() {}

  //   @EventDuration(...withValues('summary'), null, ['gauge', 'histogram', 'summary'])
  //   triggerTimerByMetricFilter() {}
}
