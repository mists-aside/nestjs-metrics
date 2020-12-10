import {ModuleMetadata} from '@nestjs/common/interfaces';
import {Type} from '@nestjs/common';

export interface MetricsAdapters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MetricsModuleOptions {
  adapters: MetricsAdapters;
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

  private cAdapters: MetricsAdapters = {};

  get adapters(): MetricsAdapters {
    return this.cAdapters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addAdapter(name: string, adapter: any): void {
    this.cAdapters[name] = adapter;
  }

  addAdapters(adapters: MetricsAdapters): void {
    this.cAdapters = Object.assign({}, this.cAdapters, adapters);
  }

  clear(): void {
    this.cAdapters = {};
  }
}
