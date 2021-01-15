import {SummaryAbstract, Tags, TimerMethod} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

import {PrometheusInvalidLabelError} from './errors';
import {Trait} from './trait';

export interface SummaryFactory {
  (label: string): prometheus.Summary<string>;
}

export class Summary extends SummaryAbstract {
  protected metrics: {[key: string]: prometheus.Histogram<string>} = {};

  protected factory: SummaryFactory;
  protected availableTagKeys: string[];

  constructor(availableTagKeys: string[] = [], factory?: SummaryFactory) {
    super();
    this.availableTagKeys = availableTagKeys;
    this.factory = factory;
  }

  getSummary(label: string): prometheus.Summary<string> {
    const localLabel = (this as any).formLabel(label);

    return (this as any).getMetric(
      label,
      {
        name: localLabel,
        help: `Summary for ${localLabel}`,
        labelNames: this.availableTagKeys,
      },
      prometheus.Summary,
    ) as prometheus.Summary<string>;

    // if (!this.summaries[label]) {
    //   this.summaries[label] = !this.factory
    //     ? new prometheus.Summary<string>({
    //         name: label,
    //         help: label,
    //       })
    //     : this.factory(label);
    // }
    // return this.summaries[label];
  }

  observe(value: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getSummary(label).observe(tags, value);
  }

  reset(label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getSummary(label).reset();
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getSummary(label).startTimer(tags);
  }
}

Object.getOwnPropertyNames(Trait.prototype).forEach((key) => {
  Summary.prototype[key] = Trait.prototype[key];
});
