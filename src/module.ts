import {DynamicModule, Module, Provider} from '@nestjs/common';

import {Config} from './config';
import {StatsController} from './controller';
import {StatsAsyncOptions, StatsOptions, StatsOptionsFactory} from './options';
import {PATH_METADATA} from '@nestjs/common/constants';

// import { collectDefaultMetrics } from "prom-client";
// import { PROMETHEUS_OPTIONS } from "./constants";
// import { PrometheusController } from "./controller";
// import {
//   StatsAsyncOptions,
//   StatsOptions,
//   StatsOptionsFactory,
// } from "./interfaces";

@Module({})
export class StatsModule {
  public static register(options: StatsOptions): DynamicModule {
    const config = Config.getInstance();

    // config.setTypes(options.types || []);\
    if (options.prometheus) {
      config.setPrometheusOptions(options.prometheus);
    }
    config.setStatsdOptions(options.statsd || 'dummy');

    StatsModule.configureServer(options);

    return {
      module: StatsModule,
      controllers: [], //[PrometheusController],
    };
  }

  public static registerAsync(options: StatsAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: StatsModule,
      controllers: [], //[PrometheusController],
      imports: options.imports,
      providers: [...asyncProviders],
    };
  }

  public static createAsyncProviders(options: StatsAsyncOptions): Provider[] {
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

  public static createAsyncOptionsProvider(options: StatsAsyncOptions): Provider {
    /**
     * Not currently supported since there doesn't seem to be a way to get
     * the result of the function during configuration.
     */
    // if (options.useFactory) {
    //   return {
    //     provide: PROMETHEUS_OPTIONS,
    //     useFactory: options.useFactory,
    //     inject: options.inject || [],
    //   };
    // }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error('Invalid configuration. Must provide useClass or useExisting');
    }

    return {
      provide: 'NEST_METRICS_OPTIONS',
      async useFactory(optionsFactory: StatsOptionsFactory): Promise<StatsOptions> {
        const userOptions = await optionsFactory.createStatsOptions();
        const opts = StatsModule.makeDefaultOptions(userOptions);

        StatsModule.configureServer(opts);

        return opts;
      },
      inject: [inject],
    };
  }

  private static configureServer(options: StatsOptions): void {
    if (options.prometheus && options.prometheus.route) {
      Reflect.defineMetadata(PATH_METADATA, options.prometheus.route, StatsController);
    }
  }

  private static makeDefaultOptions(options?: StatsOptions): Required<StatsOptions> {
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
