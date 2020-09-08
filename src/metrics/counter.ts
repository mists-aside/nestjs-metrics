import {CounterOptions} from './options';
import {Metrics} from '../enum';
import {Metric} from './generic';
import {Tags} from '../options';

export class Counter extends Metric {
  constructor(name: string, options?: CounterOptions) {
    super(name, Metrics.Counter, options);
  }

  inc(value = 1, tags?: Tags): void {
    this.prometheusMetric.inc(tags || {}, value);
    if (value === 1) {
      this.statsdClient.increment(tags || {});
    } else {
      this.statsdClient.counter(this.statsdName, value, tags || {});
    }
  }
}
