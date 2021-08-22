import {Tags} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import {CounterConfiguration, LabelValues, Metric, Counter as PromCounter, register} from 'prom-client';

import {PrometheusCounter} from '..';

export const mockPromCounterLogger = new Logger('mock-prom-client');

export class MockPromCounter<T extends string> extends PromCounter<T> {
  protected name: string;
  constructor(configuration: CounterConfiguration<T>) {
    super(configuration);

    this.name = configuration.name;
  }

  inc(labels?: LabelValues<T> | number | null, value?: number): void {
    const options = {
      name: this.name,
      labels: typeof labels === 'number' ? null : labels,
      value: typeof labels === 'number' ? labels : value,
    };
    mockPromCounterLogger.debug(mlm`MockPromCounter.inc${options}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  labels(labels: LabelValues<T> | string, ...values: string[]): PromCounter.Internal {
    return this;
  }

  reset(): void {
    mockPromCounterLogger.debug(mlm`MockPromCounter.reset${{name: this.name}}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  remove(labels: LabelValues<T> | string, ...values: string[]): void {}
}

export class MockPrometheusCounter extends PrometheusCounter {
  // protected getPromCounter(
  //   label: string,
  //   tags: Tags = {},
  //   options?: Omit<CounterConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  // ): PromCounter<string> {
  //   const availableRegistries = options?.registers || [register];

  //   const registriesContainingMetric = availableRegistries.filter((reg) => reg.getSingleMetric(label));

  //   if (registriesContainingMetric.length === 0) {
  //     return new MockPromCounter<string>({
  //       name: label,
  //       help: label,
  //       labelNames: Object.keys(tags),
  //       ...(options || {}),
  //     });
  //   }

  //   let metric: Metric<string> | undefined;
  //   availableRegistries.forEach((reg) => {
  //     if (!metric) {
  //       metric = reg.getSingleMetric(label);
  //     }
  //   });
  //   availableRegistries.forEach((reg) => {
  //     if (!reg.getSingleMetric(label)) {
  //       reg.registerMetric(metric as Metric<string>);
  //     }
  //   });
  //   return availableRegistries[0].getSingleMetric(label) as PromCounter<string>;
  // }

  protected createNewCounter(
    label: string,
    tags: Tags,
    options?: Omit<CounterConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromCounter<string> {
    return new MockPromCounter<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }
}
