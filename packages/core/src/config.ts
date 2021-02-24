import {ModuleMetadata} from '@nestjs/common/interfaces';
import {Type} from '@nestjs/common';
import { Adapter, AdapterMap } from './adapters';

export interface MetricsModuleOptions {
  adapters: AdapterMap;
}

export interface MetricsModuleOptionsFactory {
  createMetricsModuleOptions(): Promise<MetricsModuleOptions> | MetricsModuleOptions;
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

/**
 * @ignore
 */
export class Config {
  private static instance: Config;

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private cAdapters: AdapterMap = {};

  get adapters(): AdapterMap {
    return this.cAdapters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addAdapter(name: string, adapter: Adapter): void {
    this.cAdapters[name] = adapter;
  }

  addAdapters(adapters: AdapterMap): void {
    this.cAdapters = {
      ...this.cAdapters,
      ...adapters
    };
  }

  clear(): void {
    this.cAdapters = {};
  }
}
