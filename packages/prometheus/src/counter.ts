import {CountableOptions, Counter, LabelOptions, Tags} from '@mists/nestjs-metrics';
import {Counter as PromCounter} from 'prom-client';

export class PrometheusCounter implements Counter {
  private static instance: Record<string, PrometheusCounter> = {};

  private counters: Record<string, [string[], PromCounter<string>]> = {};

  static getInstance(adapterLabel = ''): PrometheusCounter {
    if (!PrometheusCounter.instance[adapterLabel]) {
      PrometheusCounter.instance[adapterLabel] = new PrometheusCounter();
    }
    return PrometheusCounter.instance[adapterLabel];
  }

  private getPromCounter(label: string, tags: Tags = {}): PromCounter<string> {
    const tagKeys = Object.keys(tags);
    if (!this.counters[label]) {
      this.counters[label] = [
        tagKeys,
        new PromCounter<string>({
          name: label,
          help: label,
          labelNames: tagKeys,
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
        }),
      ];
    }
    return this.counters[label][1];
  }

  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromCounter(label, options.tags).labels(options.tags).inc(options.delta),
    );
  }

  reset(options: LabelOptions): void {
    options.labels.forEach((label: string) => this.getPromCounter(label).reset());
  }
}
