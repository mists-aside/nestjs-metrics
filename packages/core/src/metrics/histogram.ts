import {Provider} from '@nestjs/common';

import {HistogramAdapter} from '../adapters';
import {AdapterKinds, EndTimerMethod, Histogram, TimerOptions} from '../interfaces';
import {ObservableMetricOptions, MetricOptions} from './counter';
import {TimingMetricOptions} from './gauge';
import {Metric} from './metric';

// @Injectable()
export class HistogramMetric extends Metric implements Histogram {
  metricKind: 'histogram' = 'histogram';

  protected static instance: HistogramMetric;

  static getInstance(): HistogramMetric {
    if (!HistogramMetric.instance) {
      HistogramMetric.instance = new HistogramMetric();
    }
    return HistogramMetric.instance;
  }

  static getProvider(): Provider<HistogramMetric> {
    return {
      provide: HistogramMetric,
      useValue: HistogramMetric.getInstance(),
    };
  }

  observe(options: ObservableMetricOptions): void {
    const {adapter, delta, metric, tags} = options;

    const adapters = this.histogramAdapters(adapter, metric);

    adapters.forEach((histogram) => {
      histogram.observe({delta, tags});
    });
  }

  startTimer(options?: TimingMetricOptions): EndTimerMethod {
    const {adapter, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as TimingMetricOptions;

    const adapters = this.histogramAdapters(adapter, metric);

    const endTimers = adapters.map((histogram) => histogram.startTimer({tags}));

    return (options?: TimerOptions) => {
      endTimers.forEach((end) => end(options));
    };
  }

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})}
    this.histogramAdapters(adapter, metric).forEach((histogram) => {
      histogram.reset();
    });
  }

  protected histogramAdapters(adapter?: AdapterKinds, metric?: string): HistogramAdapter[] {
    return this.searchAdapters({metricKind: 'histogram'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as HistogramAdapter);
  }
}
