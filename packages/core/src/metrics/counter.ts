import {Provider} from '@nestjs/common';

import {CounterAdapter} from '../adapters';
import {AdapterKinds, Counter, CounterOptions} from '../interfaces';
import {Metric} from './metric';

export interface GaugeIncDecOptions extends CounterOptions {
  adapter?: AdapterKinds;
  metric?: string;
}

// @Injectable()
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

  inc(options?: GaugeIncDecOptions): void {
    const {adapter, delta, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as GaugeIncDecOptions;

    const adapters = this.counterAdapters(adapter, metric);
    adapters.forEach((counter) => {
      counter.inc({delta, tags});
    });
  }

  protected counterAdapters(adapter?: AdapterKinds, metric?: string): CounterAdapter[] {
    return this.searchAdapters({metricKind: 'counter'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as CounterAdapter);
  }
}
