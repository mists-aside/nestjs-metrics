import {CounterOptions} from './options';
import {Metrics} from '../enum';
import {Metric} from './metric';
import {Tags} from '../config';

export class Counter extends Metric {
  constructor(name: string, options?: CounterOptions) {
    super(name, Metrics.Counter, options);
  }

  inc(value = 1, tags?: Tags): void {
    this.prometheusMetric.inc(tags || {}, value);
    if (value === 1) {
      this.statsdClient.increment();
    } else {
      this.statsdClient.counter(this.statsdName, value);
    }
  }
}
