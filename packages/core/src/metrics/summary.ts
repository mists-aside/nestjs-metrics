import {Provider} from '@nestjs/common';

import {SummaryAdapter} from '../adapters';
import {AdapterKinds, EndTimerMethod, Summary, TimerOptions} from '../interfaces';
import {ObservableMetricOptions, MetricOptions} from './counter';
import {TimingMetricOptions} from './gauge';
import {Metric} from './metric';

// @Injectable()
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

  startTimer(options?: TimingMetricOptions): EndTimerMethod {
    const {adapter, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as TimingMetricOptions;

    const adapters = this.summaryAdapters(adapter, metric);

    const endTimers = adapters.map((summary) => summary.startTimer({tags}));

    return (options?: TimerOptions) => {
      endTimers.forEach((end) => end(options));
    };
  }

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})}
    this.summaryAdapters(adapter, metric).forEach((summary) => {
      summary.reset();
    });
  }

  protected summaryAdapters(adapter?: AdapterKinds, metric?: string): SummaryAdapter[] {
    return this.searchAdapters({metricKind: 'summary'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as SummaryAdapter);
  }
}
