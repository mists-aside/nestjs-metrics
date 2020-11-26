import {Adapter, Counter, Gauge, Histogram, Summary} from '../adapter';
import {Config} from '../config';

interface AdapterFilter {
  (value: Adapter, index: number, array: Adapter[]): unknown;
}

export class Metric {
  protected config = Config.getInstance();

  protected adapters(): Adapter[] {
    return Object.getOwnPropertyNames(this.config.adapters).map((name) => this.config.adapters[name]);
  }

  protected searchAdapters(filter: string | AdapterFilter): Adapter[] {
    if (typeof filter === 'string') {
      return this.config.adapters[filter] ? [this.config.adapters[filter]] : [];
    }

    return this.adapters().filter(filter);
  }
}
