import {Provider} from '@nestjs/common';

import {MetricType} from '../enum';
import {CountableOptions, Counter, LabelOptions} from '../interfaces';
import {Metric, MetricOptions} from './metric';

export class CounterMetric extends Metric implements Counter {
  protected static instance: CounterMetric;

  static getInstance(): CounterMetric {
    if (!CounterMetric.instance) {
      CounterMetric.instance = new CounterMetric();
    }
    return CounterMetric.instance;
  }

  async inc(options: MetricOptions & CountableOptions): Promise<void> {
    const adapters = this.getAdapters(options);
    for (const adapter of adapters) {
      // I do not know whether the called .inc method is async or not
      await (adapter.getMetric(MetricType.Counter) as Counter).inc(options);
    }
  }

  async reset(options: MetricOptions & LabelOptions): Promise<void> {
    const adapters = this.getAdapters(options);
    for (const adapter of adapters) {
      // I do not know whether the called .inc method is async or not
      await (adapter.getMetric(MetricType.Counter) as Counter).reset(options);
    }
  }
}
