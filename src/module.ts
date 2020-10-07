import {DynamicModule, Module, Provider} from '@nestjs/common';

import {Config} from './config';
import {MetricsController} from './controller';
import {MetricsModuleAsyncOptions, MetricsModuleOptions, MetricsModuleOptionsFactory} from './options';
import {PATH_METADATA} from '@nestjs/common/constants';

/**
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
   * Module (sync) register method.
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
   *
   *
   * @param options
   */
  public static register(options: MetricsModuleOptions): DynamicModule {
    const config = Config.getInstance();

    if (options.prometheus) {
      config.setPrometheusOptions(options.prometheus);
    }
    config.setStatsdOptions(options.statsd || 'dummy');

    MetricsModule.configureServer(options);

    return {
      module: MetricsModule,
      controllers: [],
    };
  }

  /**
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
        const userOptions = await optionsFactory.createStatsOptions();
        const opts = MetricsModule.makeDefaultOptions(userOptions);

        MetricsModule.configureServer(opts);

        return opts;
      },
      inject: [inject],
    };
  }

  private static configureServer(options: MetricsModuleOptions): void {
    if (options.prometheus && options.prometheus.route) {
      Reflect.defineMetadata(PATH_METADATA, options.prometheus.route, MetricsController);
    }
  }

  private static makeDefaultOptions(options?: MetricsModuleOptions): Required<MetricsModuleOptions> {
    return {
      prometheus: {
        route: '/metrics',
        defaultMetrics: {
          enabled: true,
          config: {},
        },
        ...(options.prometheus || {}),
      },
      statsd: 'dummy',
    };
  }
}
