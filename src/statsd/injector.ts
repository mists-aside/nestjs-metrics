import {Inject} from '@nestjs/common';

import {getToken} from './utils';

/**
 * StatsD Metric Injector
 *
 * This will help you inject statsd metrics into your controllers or any other classes.
 *
 * Remember you'll first need to create a provider for your metric,
 *
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { MetricsModule } from "@mists/nestjs-metrics";
 * import { makeStatsdProvider } from "@mists/nestjs-metrics/dist/statsd";
 *
 * @Module({
 *   imports: [MetricsModule.register()],
 *   providers: [makeStatsdProvider('statsd_metric')],
 * })
 * export class AppModule {}
 * ```
 *
 * then inject it into your class:
 *
 * ```typescript
 * import { Controller } from "@nestjs/common";
 * import { StatsDClient } from "statsd-client";
 * import { InjectStatsdMetric } from "@mists/nestjs-metrics/dist/statsd";
 *
 * @Controller('/route')
 * export class MetricsController {
 *   constructor(@InjectStatsdMetric('statsd_metric') protected metric: StatsDClient) {}
 *
 *   @Get()
 *   public yourMetricMethod(): string {
 *     // ...
 *     this.metric.inc('name.space');
 *     // ...
 *   }
 * }
 * ```
 */
export function InjectStatsdMetric(
  name: string,
): (target: object, key: string | symbol, index?: number | undefined) => void {
  const token = getToken(name);

  return Inject(token);
}
