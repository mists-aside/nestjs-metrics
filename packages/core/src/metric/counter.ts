import {Injectable} from '@nestjs/common';

import {Adapter, Counter as CounterInterface, Tags} from '../adapter/interfaces';
import {Metric} from './metric';

@Injectable()
export class Counter extends Metric {
  protected static instance: Counter;

  static getInstance(): Counter {
    if (!Counter.instance) {
      Counter.instance = new Counter();
    }
    return Counter.instance;
  }

  inc(delta?: number, label?: string, tags?: Tags, adapter?: string): void {
    this.counterAdapters(adapter).forEach((counter) => {
      counter.inc(delta, label, tags);
    });
  }

  protected counterAdapters(adapter?: string): CounterInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'counter',
    ) as CounterInterface[];
  }
}
