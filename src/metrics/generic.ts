/* eslint-disable @typescript-eslint/no-explicit-any */
import {getStatsdClient} from '../statsd/utils';
import {MetricOptions} from './options';
import {getPrometheusMetric} from '../prometheus/utils';
import {Metrics} from '../enum';
import {Tags} from '../options';

/**
 * Abstract Metric Class, used to extends all supported metrics.
 */
export class Metric {
  /**
   * @link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts#L115
   */
  protected statsdClient: any;
  /**
   * @link https://github.com/siimon/prom-client/blob/master/index.d.ts#L114
   */
  protected prometheusMetric: any;

  constructor(protected name: string, type: Metrics, protected options: MetricOptions) {
    this.statsdClient = getStatsdClient(name, options.statsd || 'dummy');

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

    return (newTags?: Tags): void => {
      prometheusEnd(newTags || tags || {});
      this.statsdClient.timing(this.statsdName, stasdStart, newTags || tags || {});
    };
  }
}
