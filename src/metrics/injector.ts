import {Inject} from '@nestjs/common';
import {getToken} from './utils';

// jscpd:ignore-start
/**
 * Metric Injector
 *
 * This will help you inject metrics into your controllers or any other classes.
 *
 * Remember you'll first need to create a provider for your metric,
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
 *
 * then inject it into your class:
 *
 * ```typescript
 * @Controller('/route')
 * export class MetricsController {
 *   constructor(@InjectMetric('metrics_injector') protected counter: Counter) {}
 *
 *   @Get()
 *   public yourMetricMethod(): string {
 *     // ...
 *     this.counter.inc();
 *     // ...
 *   }
 * }
 * ```
 */
export function InjectMetric(name: string): (target: object, key: string | symbol, index?: number | undefined) => void {
  const token = getToken(name);

  return Inject(token);
}
// jscpd:ignore-end
