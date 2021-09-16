import {CountableOptions, EndTimerMethod, Gauge, ObservableOptions, Tags, TimerOptions} from '@mists/nestjs-metrics';
import {GaugeConfiguration, LabelValues, Gauge as PromGauge, Metric as PromMetric, register} from 'prom-client';

import {Metric, SimplePromMetricConfiguration} from './metric';

type SimpleGaugeConfiguration<T extends string> = Omit<GaugeConfiguration<T>, 'name' | 'help' | 'labelNames'>;

export class PrometheusGauge extends Metric implements Gauge {
  private static instance: Record<string, PrometheusGauge> = {};

  static getInstance(adapterLabel = ''): PrometheusGauge {
    if (!PrometheusGauge.instance[adapterLabel]) {
      PrometheusGauge.instance[adapterLabel] = new PrometheusGauge();
    }
    return PrometheusGauge.instance[adapterLabel];
  }

  protected getPromGauge(
    label: string,
    tags: Tags = {},
    options?: SimpleGaugeConfiguration<string>,
  ): PromGauge<string> {
    return this.getRegistryMetric(label, tags, {
      ...options,
      callable: (l: string, t: Tags = {}, o?: SimplePromMetricConfiguration<string>) =>
        this.createNewGauge(l, t, o as SimpleGaugeConfiguration<string>),
    }) as PromGauge<string>;
  }

  protected createNewGauge(label: string, tags: Tags, options?: SimpleGaugeConfiguration<string>): PromGauge<string> {
    return new PromGauge<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }

  dec(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromGauge(label, options.tags, options.options).dec(options.tags as LabelValues<string>, options.delta),
    );
  }

  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromGauge(label, options.tags, options.options).inc(options.tags as LabelValues<string>, options.delta),
    );
  }

  set(options: ObservableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromGauge(label, options.tags, options.options).set(options.tags as LabelValues<string>, options.delta),
    );
  }

  startTimer(options: TimerOptions): EndTimerMethod {
    const methods = options.labels.map((label: string) =>
      this.getPromGauge(label, options.tags, options.options).startTimer(options.tags as LabelValues<string>),
    );
    return (opts?: TimerOptions) => {
      methods.forEach((method) => method((opts || options).tags as LabelValues<string>));
    };
  }
}