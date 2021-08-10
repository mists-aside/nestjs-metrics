import {CountableOptions, Counter, MetricOptions, Tags} from '@mists/nestjs-metrics';
import {CounterConfiguration, LabelValues, Counter as PromCounter} from 'prom-client';

export class PrometheusCounter implements Counter {
  private static instance: Record<string, PrometheusCounter> = {};

  private counters: Record<string, [string[], PromCounter<string>]> = {};

  static getInstance(adapterLabel = ''): PrometheusCounter {
    if (!PrometheusCounter.instance[adapterLabel]) {
      PrometheusCounter.instance[adapterLabel] = new PrometheusCounter();
    }
    return PrometheusCounter.instance[adapterLabel];
  }

  private getPromCounter(
    label: string,
    tags: Tags = {},
    options?: Omit<CounterConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromCounter<string> {
    const tagKeys = Object.keys(tags);
    if (!this.counters[label]) {
      this.counters[label] = [
        tagKeys,
        new PromCounter<string>({
          name: label,
          help: label,
          labelNames: tagKeys,
          ...(options || {}),
        }),
      ];
    }
    const tagKeysInt = this.counters[label][0].filter((key: string) => tagKeys.includes(key));
    if (tagKeysInt.length != tagKeys.length || tagKeysInt.length != this.counters[label][0].length) {
      this.counters[label] = [
        [...new Set([...tagKeys, ...this.counters[label][0]])],
        new PromCounter<string>({
          name: label,
          help: label,
          labelNames: tagKeys,
          ...(options || {}),
        }),
      ];
    }
    return this.counters[label][1];
  }

  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromCounter(label, options.tags, options.options)
        .labels(options.tags as LabelValues<string>)
        .inc(options.delta),
    );
  }

  reset(options: MetricOptions): void {
    options.labels.forEach((label: string) => this.getPromCounter(label).reset());
  }
}
