import {Tags} from '@mists/nestjs-metrics';
import {
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  Metric as PromMetric,
  register,
} from 'prom-client';

export type PromMetricConfiguration<T extends string> =
  | CounterConfiguration<T>
  | HistogramConfiguration<T>
  | GaugeConfiguration<T>;

export type SimplePromMetricConfiguration<T extends string> = Omit<
  PromMetricConfiguration<T>,
  'name' | 'help' | 'labelNames'
>;

export interface GetRegistryMetricCallable {
  (label: string, tags: Tags, options?: SimplePromMetricConfiguration<string>): PromMetric<string>;
}

export class Metric {
  protected getRegistryMetric(
    label: string,
    tags: Tags = {},
    options: SimplePromMetricConfiguration<string> & {
      callable: GetRegistryMetricCallable;
    },
  ): PromMetric<string> {
    const availableRegistries = options?.registers || [register];

    const registriesContainingMetric = availableRegistries.filter((reg) => reg.getSingleMetric(label));

    // TODO: need to play with registries ... don't think this is correct
    if (registriesContainingMetric.length === 0) {
      return options.callable(label, tags, options) as PromMetric<string>;
    }

    let metric: PromMetric<string> | undefined;

    availableRegistries.forEach((reg) => {
      if (!metric) {
        metric = reg.getSingleMetric(label);
      }
    });

    availableRegistries.forEach((reg) => {
      if (!reg.getSingleMetric(label)) {
        reg.registerMetric(metric as PromMetric<string>);
      }
    });

    return availableRegistries[0].getSingleMetric(label) as PromMetric<string>;
  }
}
