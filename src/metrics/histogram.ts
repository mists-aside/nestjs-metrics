import {Metrics} from '../metrics';
import {getPrometheusMetric} from '../prometheus/utils';
import {Metric} from './metric';
import {HistogramOptions} from './utils';

export class Histogram extends Metric {
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

  startTimer(): () => void {
    const prometheusEnd = this.prometheusMetric.startTimer();
    const stasdStart = new Date();

    return (): void => {
      prometheusEnd();
      this.statsdClient.histogram(this.statsdName, stasdStart);
    };
  }
}
