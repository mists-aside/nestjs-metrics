import {PrometheusOptions} from './prometheus/options';
import {StatsDOptions} from './statsd/options';
import {ModuleMetadata} from '@nestjs/common/interfaces';
import {Type} from '@nestjs/common';

export enum StatsTypes {
  // // https://collectd.org/
  // Collectd,
  // // https://docs.fluentd.org/
  // Fluentd,
  // https://prometheus.io/
  Prometheus,
  // https://github.com/statsd/statsd
  Statsd,
}

export interface MetricsModuleOptions {
  prometheus?: PrometheusOptions;
  statsd?: StatsDOptions;
}

export interface MetricsModuleOptionsFactory {
  createStatsOptions(): Promise<MetricsModuleOptions> | MetricsModuleOptions;
}

export interface MetricsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MetricsModuleOptionsFactory>;
  useClass?: Type<MetricsModuleOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  /**
   * Not currently supported since there doesn't seem to be a way to get
   * the result of the function during configuration.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // useFactory?(...args: any[]): Promise<StatsOptions> | StatsOptions;
}
