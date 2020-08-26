import {Metrics} from '../metrics';
import {getPrometheusMetric} from '../prometheus/utils';
import {Timer} from './metric';
import {HistogramOptions} from './utils';

export class Histogram extends Timer() {
  constructor(protected name: string, protected options?: HistogramOptions) {
    super(name);

    this.prometheusMetric = getPrometheusMetric(Metrics.Histogram, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }

  observe(value: number): void {
    this.prometheusMetric.observe(value);
    this.statsdClient.histogram(this.statsdName, value, this.options.stasd || {});
  }
}
