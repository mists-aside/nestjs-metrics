/* eslint-disable @typescript-eslint/no-explicit-any */
import {getStatsdClient} from '../statsd/utils';
import {MetricOptions} from './options';
import {getPrometheusMetric} from '../prometheus/utils';
import {Metrics} from '../enum';
import {Tags} from '../config';

export class Metric {
  protected statsdClient: any;
  protected prometheusMetric: any;

  constructor(protected name: string, type: Metrics, protected options?: MetricOptions) {
    this.statsdClient = getStatsdClient();

    this.options = options = {
      ...(options || {}),
    };

    this.prometheusMetric = getPrometheusMetric(type, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }

  protected get statsdName(): string {
    return this.name.replace(/_/gi, '.');
  }
}

export class Timer extends Metric {
  startTimer(tags?: Tags): () => void {
    const prometheusEnd = this.prometheusMetric.startTimer(tags || {});
    const stasdStart = new Date();

    return (): void => {
      prometheusEnd();
      this.statsdClient.timing(this.statsdName, stasdStart);
    };
  }
}
