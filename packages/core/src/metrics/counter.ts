import {Provider} from '@nestjs/common';

import {CounterAdapter} from '../adapters';
import {AdapterKinds, CountableOptions, Counter, ObservableOptions} from '../interfaces';
import {Metric} from './metric';

export interface MetricOptions {
  adapter?: AdapterKinds;
  metric?: string;
}

export type CountableMetricOptions = CountableOptions & MetricOptions;

export type ObservableMetricOptions = ObservableOptions & MetricOptions;

export class CounterMetric extends Metric implements Counter {
  metricKind: 'counter' = 'counter';

  protected static instance: CounterMetric;

  static getInstance(): CounterMetric {
    if (!CounterMetric.instance) {
      CounterMetric.instance = new CounterMetric();
    }
    return CounterMetric.instance;
  }

  static getProvider(): Provider<CounterMetric> {
    return {
      provide: CounterMetric,
      useValue: CounterMetric.getInstance(),
    };
  }

  inc(options?: CountableMetricOptions): void {
    const {adapter, delta, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as CountableMetricOptions;

    const adapters = this.counterAdapters(adapter, metric);
    adapters.forEach((counter) => {
      counter.inc({delta, tags});
    });
  }

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})} as MetricOptions;
    this.counterAdapters(adapter, metric).forEach((counter) => {
      counter.reset();
    });
  }

  protected counterAdapters(adapter?: AdapterKinds, metric?: string): CounterAdapter[] {
    return this.searchAdapters({metricKind: 'counter'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as CounterAdapter);
  }
}
