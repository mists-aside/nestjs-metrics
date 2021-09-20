import {Tags, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import {GaugeConfiguration, LabelValues, Gauge as PromGauge} from 'prom-client';

import {promMock} from './mock';
import {PrometheusGauge} from '..';

export const mockPromGaugeLogger = new Logger('mock-prom-client');

export class MockPromGauge<T extends string> extends promMock<string>(PromGauge) {
  constructor(configuration: GaugeConfiguration<T>) {
    super(configuration);
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

  /**
   * Set gauge value to current epoch time in ms
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToCurrentTime(): void {}
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
