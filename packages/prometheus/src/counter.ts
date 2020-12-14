import { CounterAbstract, Tags } from "@mists/nestjs-metrics";
import * as prometheus from 'prom-client';

export interface CounterFactory {
  (label: string): prometheus.Counter<string>
}

export class Counter extends CounterAbstract {
  protected counters: { [key: string]: prometheus.Counter<string> };

  protected factory: CounterFactory;

  constructor(factory?: CounterFactory) {
    super();
    this.factory = factory;
  }

  getCounter(label: string): prometheus.Counter<string> {
    if (!this.counters[label]) {
      this.counters[label] = !this.factory ? new prometheus.Counter<string>({
        name: label,
        help: label
      }) : this.factory(label)
    }
    return this.counters[label];
  }

  inc(delta?: number, label?: string, tags?: Tags): void {
    return this.getCounter(label).inc(tags, delta)
  }

}
