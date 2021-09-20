import {EndTimerMethod, Histogram, MetricOptions, ObservableOptions, Tags, TimerOptions} from '@mists/nestjs-metrics';
import {HistogramConfiguration, LabelValues, Histogram as PromHistogram} from 'prom-client';

import {Metric, SimplePromMetricConfiguration} from './metric';

type SimpleHistogramConfiguration<T extends string> = Omit<HistogramConfiguration<T>, 'name' | 'help' | 'labelNames'>;

export class PrometheusHistogram extends Metric implements Histogram {
  private static instance: Record<string, PrometheusHistogram> = {};

  static getInstance(adapterLabel = ''): PrometheusHistogram {
    if (!PrometheusHistogram.instance[adapterLabel]) {
      PrometheusHistogram.instance[adapterLabel] = new PrometheusHistogram();
    }
    return PrometheusHistogram.instance[adapterLabel];
  }

  protected getPromHistogram(
    label: string,
    tags: Tags = {},
    options?: SimpleHistogramConfiguration<string>,
  ): PromHistogram<string> {
    return this.getRegistryMetric(label, tags, {
      ...options,
      callable: (l: string, t: Tags = {}, o?: SimplePromMetricConfiguration<string>) =>
        this.createNewHistogram(l, t, o as SimpleHistogramConfiguration<string>),
    }) as PromHistogram<string>;
  }

  protected createNewHistogram(
    label: string,
    tags: Tags,
    options?: SimpleHistogramConfiguration<string>,
  ): PromHistogram<string> {
    return new PromHistogram<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }

  observe(options: ObservableOptions): void {
    const {delta, labels, tags} = options;
    labels.forEach((label) => this.getPromHistogram(label, tags, options.options).observe(tags || {}, delta));
  }

  reset(options: MetricOptions): void {
    options.labels.forEach((label) => this.getPromHistogram(label).reset());
  }

  startTimer(options: TimerOptions): EndTimerMethod {
    const methods = options.labels.map((label: string) =>
      this.getPromHistogram(label, options.tags, options.options).startTimer(options.tags || {}),
    );
    return (opts?: TimerOptions) => {
      // TODO: simplify when https://github.com/siimon/prom-client/pull/466 is applied
      return Math.trunc(
        methods
          .map((method) => method((opts || options).tags || {}))
          .reduce((a, b) => {
            const c = b as unknown as number;
            return a + c;
          }, 0) / methods.length,
      );
    };
  }
}
