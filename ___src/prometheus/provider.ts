import {Metric} from 'prom-client';

import {Provider} from '@nestjs/common';

import {Metrics} from '../enum';
import {PrometheusMetricOptions} from './options';
import {getPrometheusMetric, getToken} from './utils';

/**
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { MetricsModule, Metric } from "@mists/nestjs-metrics";
 * import { makePrometheusProvider } from "@mists/nestjs-metrics/dist/prometheus";
 *
 * @Module({
 *   imports: [MetricsModule.register()],
 *   providers: [makePrometheusProvider(Metric.Counter, 'metrics_prometheus_counter')],
 * })
 * export class AppModule {}
 * ```
 */
export function makePrometheusProvider(type: Metrics, options: PrometheusMetricOptions): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): Metric<string> {
      return getPrometheusMetric(type, options);
    },
  };
}
