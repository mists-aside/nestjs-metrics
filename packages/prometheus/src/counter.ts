import {CounterAbstract, Tags} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

import {PrometheusInvalidLabelError} from './errors';

export interface CounterFactory {
  (label: string, availableTagKeys?: string[]): prometheus.Counter<string>;
}

export class Counter extends CounterAbstract {
  protected counters: {[key: string]: prometheus.Counter<string>} = {};

  protected factory: CounterFactory;
  protected availableTagKeys: string[];

  constructor(availableTagKeys: string[] = [], factory?: CounterFactory) {
    super();
    this.availableTagKeys = availableTagKeys;
    this.factory = factory;
  }

  formLabel(label: string) {
    return `${label}::${this.availableTagKeys.join('|')}`;
  }

  getCounter(label: string): prometheus.Counter<string> {
    const localLabel = this.formLabel(label);

    console.log(prometheus.register.metrics(), this.counters);

    if (!this.counters[localLabel]) {
      this.counters[localLabel] = this.factory
        ? this.factory(localLabel, this.availableTagKeys)
        : new prometheus.Counter<string>({
            name: localLabel,
            help: `Counter for ${localLabel}`,
            labelNames: this.availableTagKeys,
          });
    }
    return this.counters[localLabel];
  }

  inc(delta?: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    this.getCounter(label).inc(tags, delta);
  }
}
