import {CountableOptions, Tags, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import {GaugeConfiguration, LabelValues, Gauge as PromGauge} from 'prom-client';

import {PrometheusGauge} from '..';

export const mockPromGaugeLogger = new Logger('mock-prom-client');

export class MockPromGauge<T extends string> extends PromGauge<T> {
  protected name: string;
  constructor(configuration: GaugeConfiguration<T>) {
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

  dec(labels?: LabelValues<T> | number | null, value?: number): void {
    mockPromGaugeLogger.debug(mlm`MockPromGauge.dec${this.parseArgs(labels, value)}`);
  }

  inc(labels?: LabelValues<T> | number | null, value?: number): void {
    mockPromGaugeLogger.debug(mlm`MockPromGauge.inc${this.parseArgs(labels, value)}`);
  }

  set(labels?: LabelValues<T> | number | null, value?: number): void {
    mockPromGaugeLogger.debug(mlm`MockPromGauge.set${this.parseArgs(labels, value)}`);
  }

  startTimer(labels?: LabelValues<T>): (labels?: LabelValues<T>) => void {
    mockPromGaugeLogger.debug(mlm`MockPromGauge.startTimer${this.parseArgs(labels)}`);

    return (ls?: LabelValues<T>) => {
      mockPromGaugeLogger.debug(
        mlm`MockPromGauge.endTimer${{
          ...(this.parseArgs(labels) as TimerOptions),
          labels: ls || labels,
        }}`,
      );
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  labels(labels: LabelValues<T> | string, ...values: string[]): PromGauge.Internal<T> {
    return this;
  }

  reset(): void {
    mockPromGaugeLogger.debug(mlm`MockPromGauge.reset${{name: this.name}}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  remove(labels: LabelValues<T> | string, ...values: string[]): void {}
}

export class MockPrometheusGauge extends PrometheusGauge {
  protected createNewGauge(
    label: string,
    tags: Tags,
    options?: Omit<GaugeConfiguration<string>, 'name' | 'help' | 'labelNames'>,
  ): PromGauge<string> {
    return new MockPromGauge<string>({
      name: label,
      help: label,
      labelNames: Object.keys(tags),
      ...(options || {}),
    });
  }
}
