import {CounterOptions} from './options';
import {Metrics} from '../metrics';
import {getPrometheusMetric} from '../prometheus/utils';
import {Metric} from './metric';

export class Counter extends Metric {
  constructor(protected name: string, protected options?: CounterOptions) {
    super(name);

    this.prometheusMetric = getPrometheusMetric(Metrics.Counter, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }

  inc(value = 1): void {
    this.prometheusMetric.inc(value);
    if (value === 1) {
      this.statsdClient.increment();
    } else {
      this.statsdClient.counter(this.statsdName, value);
    }
  }
}
