import { Metrics } from '../metrics';
import { getPrometheusMetric } from '../prometheus/utils';
import { getStatsdClient } from '../statsd/utils';
import { CounterOptions } from './utils';
import { Metric } from './metric';

export class Counter extends Metric {
  constructor(
    protected name: string,
    protected options?: CounterOptions) {
      super();

      this.prometheusMetric = getPrometheusMetric(Metrics.Counter, {
        ...(options.prometheus || {}),
        name,
        ...({ help: options.prometheus ? options.prometheus.help || name : name })
      })
  }

  inc(): void {
    this.statsdClient.inc(this.name.replace(/_/ig, '.'));
    this.prometheusMetric.inc();
  }
}
