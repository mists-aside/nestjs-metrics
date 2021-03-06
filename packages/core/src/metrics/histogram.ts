import {Provider} from '@nestjs/common';

import {HistogramAdapter} from '../adapters';
import {AdapterKinds, Histogram} from '../interfaces';
import {EndTimerMethod} from '../interfaces';
import {MetricOptions, ObservableMetricOptions} from './counter';
import {TimingMetricOptions} from './gauge';
import {Metric} from './metric';

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

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})} as MetricOptions;
    this.histogramAdapters(adapter, metric).forEach((histogram) => {
      histogram.reset();
    });
  }

  startTimer(options?: TimingMetricOptions): EndTimerMethod {
    const {adapter, metric, tags} = {
      ...(options || {}),
    } as TimingMetricOptions;

    const adapters = this.histogramAdapters(adapter, metric);

    const endTimers = adapters.map((histogram) => histogram.startTimer({tags}));

    return (options?: TimingMetricOptions) => {
      endTimers.forEach((end) => end(options));
    };
  }

  protected histogramAdapters(adapter?: AdapterKinds, metric?: string): HistogramAdapter[] {
    return this.searchAdapters({metricKind: 'histogram'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as HistogramAdapter);
  }
}
