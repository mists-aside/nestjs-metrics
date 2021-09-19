import {Tags, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import {LabelValues, Summary as PromSummary, SummaryConfiguration} from 'prom-client';

import {PrometheusSummary} from '..';

export const mockPromSummaryLogger = new Logger('mock-prom-client');

export class MockPromSummary<T extends string> extends PromSummary<T> {
  protected name: string;
  constructor(configuration: SummaryConfiguration<T>) {
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
    mockPromSummaryLogger.debug(mlm`MockPromSummary.observe${options}`);
  }

  startTimer(labels?: LabelValues<T>): (labels?: LabelValues<T>) => void {
    mockPromSummaryLogger.debug(mlm`MockPromSummary.startTimer${this.parseArgs(labels)}`);

    return (ls?: LabelValues<T>) => {
      mockPromSummaryLogger.debug(
        mlm`MockPromSummary.endTimer${{
          ...(this.parseArgs(labels) as TimerOptions),
          labels: ls || labels,
        }}`,
      );
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  labels(labels: LabelValues<T> | string, ...values: string[]): PromSummary.Internal<T> {
    return this;
  }

  reset(): void {
    mockPromSummaryLogger.debug(mlm`MockPromSummary.reset${{name: this.name}}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  remove(labels: LabelValues<T> | string, ...values: string[]): void {}
}

export class MockPrometheusSummary extends PrometheusSummary {
  protected createNewSummary(
    label: string,
    tags: Tags,
    options?: Omit<SummaryConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromSummary<string> {
    return new MockPromSummary<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }
}
