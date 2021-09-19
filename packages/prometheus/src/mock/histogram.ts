import {Tags, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import {HistogramConfiguration, LabelValues, Histogram as PromHistogram} from 'prom-client';

import {PrometheusHistogram} from '..';

export const mockPromHistogramLogger = new Logger('mock-prom-client');

export class MockPromHistogram<T extends string> extends PromHistogram<T> {
  protected name: string;
  constructor(configuration: HistogramConfiguration<T>) {
    super(configuration);

    this.name = configuration.name;
  }

  protected parseArgs(labels?: LabelValues<T> | number | null, value?: number): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let options: Record<string, any> = {
      name: this.name,
      labels: typeof labels === 'number' ? null : labels,
    };

    if (value) {
      options = {
        ...options,
        value: typeof labels === 'number' ? labels : value,
      };
    }

    return options;
  }

  observe(labels?: LabelValues<T> | number | null, value?: number): void {
    const options = {
      name: this.name,
      labels: typeof labels === 'number' ? null : labels,
      value: typeof labels === 'number' ? labels : value,
    };
    mockPromHistogramLogger.debug(mlm`MockPromHistogram.observe${options}`);
  }

  /**
   * TODO: https://github.com/siimon/prom-client/issues/465
   */
  startTimer(labels?: LabelValues<T>): (labels?: LabelValues<T>) => number {
    mockPromHistogramLogger.debug(mlm`MockPromHistogram.startTimer${this.parseArgs(labels)}`);

    return ((ls?: LabelValues<T>) => {
      mockPromHistogramLogger.debug(
        mlm`MockPromHistogram.endTimer${{
          ...(this.parseArgs(labels) as TimerOptions),
          labels: ls || labels,
        }}`,
      );
    }) as (labels?: LabelValues<T>) => number;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  labels(labels: LabelValues<T> | string, ...values: string[]): PromHistogram.Internal<T> {
    return this;
  }

  reset(): void {
    mockPromHistogramLogger.debug(mlm`MockPromHistogram.reset${{name: this.name}}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  remove(labels: LabelValues<T> | string, ...values: string[]): void {}
}

export class MockPrometheusHistogram extends PrometheusHistogram {
  protected createNewHistogram(
    label: string,
    tags: Tags,
    options?: Omit<HistogramConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromHistogram<string> {
    return new MockPromHistogram<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }
}
