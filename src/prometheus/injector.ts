import {Inject} from '@nestjs/common';
import {getToken} from './utils';

// jscpd:ignore-start
/**
 * Prometheus Metric Injector
 *
 * This will help you inject prometheus metrics into your controllers or any other classes.
 *
 * Remember you'll first need to create a provider for your metric,
 *
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { MetricsModule } from "@mists/nestjs-metrics";
 * import { makePrometheusProvider } from "@mists/nestjs-metrics/dist/prometheus";
 *
 * @Module({
 *   imports: [MetricsModule.register()],
 *   providers: [makePrometheusProvider(Metric.Counter, 'metrics_prometheus_counter')],
 * })
 * export class AppModule {}
 * ```
 *
 * then inject it into your class:
 *
 * ```typescript
 * import { Controller } from "@nestjs/common";
 * import * as PromClient from "statsd-client";
 * import { InjectStatsdMetric } from "@mists/nestjs-metrics/dist/statsd";
 *
 * @Controller('/route')
 * export class MetricsController {
 *   constructor(@InjectStatsdMetric('metrics_prometheus_counter') protected counter: PromClient.Counter<string>) {}
 *
 *   @Get()
 *   public yourMetricMethod(): string {
 *     // ...
 *     this.counter.inc('name.space');
 *     // ...
 *   }
 * }
 * ```
 */
export function InjectPrometheusMetric(
  name: string,
): (target: object, key: string | symbol, index?: number | undefined) => void {
  const token = getToken(name);

  return Inject(token);
}
// jscpd:ignore-end
