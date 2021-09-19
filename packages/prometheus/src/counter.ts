import {CountableOptions, Counter, MetricOptions, Tags} from '@mists/nestjs-metrics';
import {CounterConfiguration, LabelValues, Counter as PromCounter} from 'prom-client';

import {Metric, SimplePromMetricConfiguration} from './metric';

type SimpleCounterConfiguration<T extends string> = Omit<CounterConfiguration<T>, 'name' | 'help' | 'labelNames'>;

export class PrometheusCounter extends Metric implements Counter {
  private static instance: Record<string, PrometheusCounter> = {};

  static getInstance(adapterLabel = ''): PrometheusCounter {
    if (!PrometheusCounter.instance[adapterLabel]) {
      PrometheusCounter.instance[adapterLabel] = new PrometheusCounter();
    }
    return PrometheusCounter.instance[adapterLabel];
  }

  protected getPromCounter(
    label: string,
    tags: Tags = {},
    options?: SimpleCounterConfiguration<string>,
  ): PromCounter<string> {
    return this.getRegistryMetric(label, tags, {
      ...options,
      callable: (l: string, t: Tags = {}, o?: SimplePromMetricConfiguration<string>) =>
        this.createNewCounter(l, t, o as SimpleCounterConfiguration<string>),
    }) as PromCounter<string>;
  }

  protected createNewCounter(
    label: string,
    tags: Tags,
    options?: SimpleCounterConfiguration<string>,
  ): PromCounter<string> {
    return new PromCounter<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }

  // jscpd:ignore-start
  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromCounter(label, options.tags, options.options).inc(options.tags || {}, options.delta),
    );
  }

  reset(options: MetricOptions): void {
    options.labels.forEach((label: string) => this.getPromCounter(label).reset());
  }
  // jscpd:ignore-end
}
