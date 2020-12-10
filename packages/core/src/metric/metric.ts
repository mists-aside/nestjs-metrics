import {Adapter} from '../adapter/interfaces';
import {Config} from '../config';

export interface AdapterFilter {
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
