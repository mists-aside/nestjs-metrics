import {EndTimerMethod, MetricOptions, ObservableOptions, Summary, Tags, TimerOptions} from '@mists/nestjs-metrics';
import {LabelValues, Summary as PromSummary, SummaryConfiguration} from 'prom-client';

import {Metric, SimplePromMetricConfiguration} from './metric';

type SimpleSummaryConfiguration<T extends string> = Omit<SummaryConfiguration<T>, 'name' | 'help' | 'labelNames'>;

export class PrometheusSummary extends Metric implements Summary {
  private static instance: Record<string, PrometheusSummary> = {};

  static getInstance(adapterLabel = ''): PrometheusSummary {
    if (!PrometheusSummary.instance[adapterLabel]) {
      PrometheusSummary.instance[adapterLabel] = new PrometheusSummary();
    }
    return PrometheusSummary.instance[adapterLabel];
  }

  protected getPromSummary(
    label: string,
    tags: Tags = {},
    options?: SimpleSummaryConfiguration<string>,
  ): PromSummary<string> {
    return this.getRegistryMetric(label, tags, {
      ...options,
      callable: (l: string, t: Tags = {}, o?: SimplePromMetricConfiguration<string>) =>
        this.createNewSummary(l, t, o as SimpleSummaryConfiguration<string>),
    }) as PromSummary<string>;
  }

  protected createNewSummary(
    label: string,
    tags: Tags,
    options?: SimpleSummaryConfiguration<string>,
  ): PromSummary<string> {
    return new PromSummary<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }

  observe(options: ObservableOptions): void {
    const {delta, labels, tags} = options;
    labels.forEach((label) => this.getPromSummary(label, tags, options.options).observe(tags || {}, delta));
  }

  reset(options: MetricOptions): void {
    options.labels.forEach((label) => this.getPromSummary(label).reset());
  }

  startTimer(options: TimerOptions): EndTimerMethod {
    const methods = options.labels.map((label: string) =>
      this.getPromSummary(label, options.tags, options.options).startTimer(options.tags || {}),
    );
    return (opts?: TimerOptions) => {
      methods.forEach((method) => method((opts || options).tags || {}));
    };
  }
}
