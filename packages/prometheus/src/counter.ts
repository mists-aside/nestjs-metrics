import {CountableOptions, Counter, MetricOptions, Tags} from '@mists/nestjs-metrics';
import {CounterConfiguration, LabelValues, Metric, Counter as PromCounter, register} from 'prom-client';

export class PrometheusCounter implements Counter {
  private static instance: Record<string, PrometheusCounter> = {};

  static getInstance(adapterLabel = ''): PrometheusCounter {
    if (!PrometheusCounter.instance[adapterLabel]) {
      PrometheusCounter.instance[adapterLabel] = new PrometheusCounter();
    }
    return PrometheusCounter.instance[adapterLabel];
  }

  protected getPromCounter(
    label: string,
    tags: Tags = {},
    options?: Omit<CounterConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromCounter<string> {
    const availableRegistries = options?.registers || [register];

    const registriesContainingMetric = availableRegistries.filter((reg) => reg.getSingleMetric(label));

    if (registriesContainingMetric.length === 0) {
      return this.createNewCounter(label, tags, options);
    }

    let metric: Metric<string> | undefined;
    availableRegistries.forEach((reg) => {
      if (!metric) {
        metric = reg.getSingleMetric(label);
      }
    });
    availableRegistries.forEach((reg) => {
      if (!reg.getSingleMetric(label)) {
        reg.registerMetric(metric as Metric<string>);
      }
    });
    return availableRegistries[0].getSingleMetric(label) as PromCounter<string>;
  }

  protected createNewCounter(
    label: string,
    tags: Tags,
    options?: Omit<CounterConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromCounter<string> {
    return new PromCounter<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }

  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) =>
      this.getPromCounter(label, options.tags, options.options).inc(options.tags as LabelValues<string>, options.delta),
    );
  }

  reset(options: MetricOptions): void {
    options.labels.forEach((label: string) => this.getPromCounter(label).reset());
  }
}
