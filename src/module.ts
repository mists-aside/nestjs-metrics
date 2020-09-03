import {DynamicModule, Module} from '@nestjs/common';

import {Config, StatsOptions} from './config';

// import { PATH_METADATA } from "@nestjs/common/constants";
// import { collectDefaultMetrics } from "prom-client";
// import { PROMETHEUS_OPTIONS } from "./constants";
// import { PrometheusController } from "./controller";
// import {
//   PrometheusAsyncOptions,
//   PrometheusOptions,
//   PrometheusOptionsFactory,
// } from "./interfaces";

@Module({})
export class StatsModule {
  public static register(options: StatsOptions): DynamicModule {
    const config = Config.getInstance();

    // config.setTypes(options.types || []);
    // config.setPrometheusOptions(options.prometheus);
    config.setStatsdOptions(options.statsd || 'dummy');

    return {
      module: StatsModule,
      controllers: [], //[PrometheusController],
    };
  }

  // public static registerAsync(options: PrometheusAsyncOptions): DynamicModule {
  //   const asyncProviders = this.createAsyncProviders(options);

  //   return {
  //     module: PrometheusModule,
  //     controllers: [PrometheusController],
  //     imports: options.imports,
  //     providers: [...asyncProviders],
  //   };
  // }

  // public static createAsyncProviders(
  //   options: PrometheusAsyncOptions,
  // ): Provider[] {
  //   if (options.useExisting) {
  //     return [this.createAsyncOptionsProvider(options)];
  //   } else if (!options.useClass) {
  //     throw new Error(
  //       "Invalid configuration. Must provide useClass or useExisting",
  //     );
  //   }

  //   return [
  //     this.createAsyncOptionsProvider(options),
  //     {
  //       provide: options.useClass,
  //       useClass: options.useClass,
  //     },
  //   ];
  // }

  // public static createAsyncOptionsProvider(
  //   options: PrometheusAsyncOptions,
  // ): Provider {
  //   /**
  //    * Not currently supported since there doesn't seem to be a way to get
  //    * the result of the function during configuration.
  //    */
  //   // if (options.useFactory) {
  //   //   return {
  //   //     provide: PROMETHEUS_OPTIONS,
  //   //     useFactory: options.useFactory,
  //   //     inject: options.inject || [],
  //   //   };
  //   // }

  //   const inject = options.useClass || options.useExisting;

  //   if (!inject) {
  //     throw new Error(
  //       "Invalid configuration. Must provide useClass or useExisting",
  //     );
  //   }

  //   return {
  //     provide: PROMETHEUS_OPTIONS,
  //     async useFactory(
  //       optionsFactory: PrometheusOptionsFactory,
  //     ): Promise<PrometheusOptions> {
  //       const userOptions = await optionsFactory.createPrometheusOptions();
  //       const opts = PrometheusModule.makeDefaultOptions(userOptions);

  //       PrometheusModule.configureServer(opts);

  //       return opts;
  //     },
  //     inject: [inject],
  //   };
  // }
}
