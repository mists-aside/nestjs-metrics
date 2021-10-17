import {DynamicModule, Module, ModuleMetadata, Provider, Type} from '@nestjs/common';

import {Config} from './config';
import {Adapter} from './interfaces';

export interface MetricsModuleOptions {
  adapters: Adapter[];
  instanceLabel?: string;
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
 * TODO:
 * Metrics module class.
 * This class will be used to initialize the metrics module within NestJs.
 *
 * ```
 * import { Module } from "@nestjs/common";
 * import { MetricsModule } from "@mists/nestjs-metrics";
 *
 * @Module({
 *   imports: [MetricsModule.register({
 *     prometheus: {
 *       // ...
 *     },
 *     statsd: {
 *       // ...
 *     }
 *   })],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class MetricsModule {
  /**
   * TODO:
   * Module (sync) register method.
   *
   * ```
   * import { Module } from "@nestjs/common";
   * import { MetricsModule } from "@mists/nestjs-metrics";
   *
   * @Module({
   *   imports: [MetricsModule.register({
   *     adapters: {
   *       // ...
   *     }
   *   })],
   * })
   * export class AppModule {}
   * ```
   *
   *
   * @param options
   */
  public static register(options: MetricsModuleOptions): DynamicModule {
    MetricsModule.configureServer(options);

    return {
      module: MetricsModule,
      controllers: [],
    };
  }

  /**
   * TODO:
   * Module async register method.
   *
   * ```
   * import { Module } from "@nestjs/common";
   * import { MetricsModule } from "@mists/nestjs-metrics";
   *
   * @Injectable()
   * export class StatsOptionsService implements StatsOptionsFactory {
   *   createStatsOptions(): StatsOptions {
   *     return new Promise(resolve => ({
   *       // see the MetricsModule::register() options
   *     }));
   *   }
   * }
   *
   * @Module({
   *   imports: [MetricsModule.registerAsync({
   *     useClass: StatsOptionsService,
   *     inject: [StatsOptionsService],
   *   })],
   * })
   * export class AppModule {}
   * ```
   *
   * @param options
   */
  public static registerAsync(options: MetricsModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MetricsModule,
      controllers: [],
      imports: options.imports,
      providers: [...asyncProviders],
    };
  }

  public static createAsyncProviders(options: MetricsModuleAsyncOptions): Provider[] {
    if (options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (!options.useClass) {
      throw new Error('Invalid configuration. Must provide useClass or useExisting');
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  protected static createAsyncOptionsProvider(options: MetricsModuleAsyncOptions): Provider {
    const inject = options.useClass || options.useExisting;
    if (!inject) {
      throw new Error('Invalid configuration. Must provide useClass or useExisting');
    }
    return {
      provide: 'NEST_METRICS_OPTIONS',
      async useFactory(optionsFactory: MetricsModuleOptionsFactory): Promise<MetricsModuleOptions> {
        const userOptions = await optionsFactory.createMetricsModuleOptions();
        const opts = MetricsModule.makeDefaultOptions(userOptions);

        MetricsModule.configureServer(opts);

        return opts;
      },
      inject: [inject],
    };
  }

  private static configureServer(options: MetricsModuleOptions): void {
    const config = Config.getInstance();
    config.addAdapters(options.adapters);
    config.instanceLabel = options.instanceLabel ? options.instanceLabel : '';

    // if (options.prometheus && options.prometheus.route) {
    //   Reflect.defineMetadata(PATH_METADATA, options.prometheus.route, MetricsController);
    // }
  }

  private static makeDefaultOptions(options?: MetricsModuleOptions): Required<MetricsModuleOptions> {
    return {
      adapters: [...((options && options.adapters) || [])],
      instanceLabel: '',
    };
  }
}
