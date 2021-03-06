import {Provider} from '@nestjs/common';

import {SummaryAdapter} from '../adapters';
import {AdapterKinds, Summary} from '../interfaces';
import {EndTimerMethod} from '../interfaces';
import {MetricOptions, ObservableMetricOptions} from './counter';
import {TimingMetricOptions} from './gauge';
import {Metric} from './metric';

export class SummaryMetric extends Metric implements Summary {
  metricKind: 'summary' = 'summary';

  protected static instance: SummaryMetric;

  static getInstance(): SummaryMetric {
    if (!SummaryMetric.instance) {
      SummaryMetric.instance = new SummaryMetric();
    }
    return SummaryMetric.instance;
  }

  static getProvider(): Provider<SummaryMetric> {
    return {
      provide: SummaryMetric,
      useValue: SummaryMetric.getInstance(),
    };
  }

  observe(options: ObservableMetricOptions): void {
    const {adapter, delta, metric, tags} = options;

    const adapters = this.summaryAdapters(adapter, metric);

    adapters.forEach((summary) => {
      summary.observe({delta, tags});
    });
  }

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})} as MetricOptions;
    this.summaryAdapters(adapter, metric).forEach((summary) => {
      summary.reset();
    });
  }

  startTimer(options?: TimingMetricOptions): EndTimerMethod {
    const {adapter, metric, tags} = {
      ...(options || {}),
    } as TimingMetricOptions;

    const adapters = this.summaryAdapters(adapter, metric);

    const endTimers = adapters.map((summary) => summary.startTimer({tags}));

    return (options?: TimingMetricOptions) => {
      endTimers.forEach((end) => end(options));
    };
  }

  protected summaryAdapters(adapter?: AdapterKinds, metric?: string): SummaryAdapter[] {
    return this.searchAdapters({metricKind: 'summary'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as SummaryAdapter);
  }
}
