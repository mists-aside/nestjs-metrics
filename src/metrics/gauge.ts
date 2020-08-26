import {Metrics} from '../metrics';
import {getPrometheusMetric} from '../prometheus/utils';
import {Counter} from './counter';
import {Timer} from './metric';
import {GaugeOptions} from './utils';

export class Gauge extends Timer(Counter) {
  constructor(protected name: string, protected options?: GaugeOptions) {
    super(name);

    this.prometheusMetric = getPrometheusMetric(Metrics.Gauge, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }

  dec(value = 1): void {
    this.prometheusMetric.dec(value);
    this.statsdClient.gaugeDelta(this.statsdName, value);
  }

  inc(value = 1): void {
    this.prometheusMetric.inc(value);
    this.statsdClient.gaugeDelta(this.statsdName, value);
  }

  set(value: number): void {
    this.prometheusMetric.set(value);
    this.statsdClient.gauge(this.statsdName, value, this.options.stasd || {});
  }
}
