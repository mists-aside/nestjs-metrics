import {Injectable} from '@nestjs/common';
import {AdapterItem} from 'src/config';
import {CounterAdapter} from '../adapters';

import {AdapterKinds, Counter, CounterOptions} from '../interfaces';
import {Metric} from './metric';

export interface CounterMetricOptions extends CounterOptions {
  adapter?: AdapterKinds;
  metric?: string;
}

@Injectable()
export class CounterMetric extends Metric implements Counter {
  metricKind: 'counter' = 'counter';

  // protected static instance: CounterMetric;

  // static getInstance(): CounterMetric {
  //   if (!CounterMetric.instance) {
  //     CounterMetric.instance = new CounterMetric();
  //   }
  //   return CounterMetric.instance;
  // }

  inc(options?: CounterMetricOptions): void {
    const {adapter, delta, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as CounterMetricOptions;
    this.counterAdapters()
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as CounterAdapter)
      .forEach((counter) => {
        counter.inc({delta, tags});
      });
  }

  protected counterAdapters(): AdapterItem[] {
    return this.searchAdapters({metricKind: 'counter'}) as AdapterItem[];
  }
}
