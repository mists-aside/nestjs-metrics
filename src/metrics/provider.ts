import {Provider} from '@nestjs/common';

import {Config} from '../config';
import {Metrics} from '../enum';
import {Metric} from './generic';
import {MetricOptions} from './options';
import {getMetric, getToken} from './utils';

/**
 * Metric Provider
 *
 * Will create a metric provider based on the metric type you need, and it's custom options.
 *
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { MetricsModule } from "@mists/nestjs-metrics";
 *
 * @Module({
 *   controllers: [MetricsController],
 *   imports: [MetricsModule.register()],
 *   providers: [makeMetricProvider(Metrics.Counter, 'metrics_injector', {})],
 * })
 * export class AppModule {}
 * ```
 */
export const makeMetricProvider = (type: Metrics, name: string, options?: MetricOptions): Provider => {
  if (!options.statsd) {
    options = {
      ...options,
      statsd: Config.getInstance().statsd || 'dummy',
    };
  }
  return {
    provide: getToken(name),
    useFactory(): Metric {
      return getMetric(type, name, options);
    },
  };
};
