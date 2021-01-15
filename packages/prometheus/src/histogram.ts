import {HistogramAbstract, Tags, TimerMethod} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

import {PrometheusInvalidLabelError} from './errors';
import {Trait} from './trait';

export interface HistogramFactory {
  (label: string): prometheus.Histogram<string>;
}

export class Histogram extends HistogramAbstract {
  protected metrics: {[key: string]: prometheus.Histogram<string>} = {};

  protected factory: HistogramFactory;
  protected availableTagKeys: string[];

  constructor(availableTagKeys: string[] = [], factory?: HistogramFactory) {
    super();
    this.availableTagKeys = availableTagKeys;
    this.factory = factory;
  }

  getHistogram(label: string): prometheus.Histogram<string> {
    const localLabel = (this as any).formLabel(label);

    return (this as any).getMetric(
      label,
      {
        name: localLabel,
        help: `Histogram for ${localLabel}`,
        labelNames: this.availableTagKeys,
      },
      prometheus.Histogram,
    ) as prometheus.Histogram<string>;

    // if (!this.histograms[label]) {
    //   this.histograms[label] = !this.factory
    //     ? new prometheus.Histogram<string>({
    //         name: label,
    //         help: label,
    //       })
    //     : this.factory(label);
    // }
    // return this.histograms[label];
  }

  observe(value: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getHistogram(label).observe(tags, value);
  }

  reset(label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getHistogram(label).reset();
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getHistogram(label).startTimer(tags);
  }
}

Object.getOwnPropertyNames(Trait.prototype).forEach((key) => {
  Histogram.prototype[key] = Trait.prototype[key];
});
