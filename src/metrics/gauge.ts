import {Counter} from './counter'
import { Metrics } from '../metrics';
import { getPrometheusMetric } from '../prometheus/utils';
import { GaugeOptions } from './utils'

export class Gauge extends Counter {

  constructor(
    protected name: string,
    protected options?: GaugeOptions
  ) {
    super(name);

    this.prometheusMetric = getPrometheusMetric(Metrics.Gauge, {
      ...(options.prometheus || {}),
      name,
      ...({ help: options.prometheus ? options.prometheus.help || name : name })
    })
  }

  dec(): void {
    this.statsdClient.dec(this.name.replace(/_/ig, '.'));
    this.prometheusMetric.dec();
  }

  set(value: number): void {
    this.statsdClient.set(this.name.replace(/_/ig, '.'), value);
    this.prometheusMetric.set(value);
  }
}
