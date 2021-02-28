import {Controller, Get, InternalServerErrorException, Res} from '@nestjs/common';
import * as promClient from 'prom-client';

/**
 * Controller used for displaying metrics.
 * So far, this controller is used for Prometheus only.
 *
 * ```
 * import { Module } from "@nestjs/common";
 * import { MetricsModule, MetricsController } from "@mists/nestjs-metrics";
 *
 * @Module({
 *   controllers: [MetricsController],
 *   imports: [MetricsModule.register({
 *     prometheus: {
 *       route: '/metrics',
 *       // ...
 *     }
 *   })],
 * })
 * export class AppModule {}
```
 */
@Controller()
export class DefaultPrometheusMetricsController {
  /**
   * @link https://github.com/siimon/prom-client#default-metrics
   */
  constructor() {
    promClient.collectDefaultMetrics();
  }

  @Get('/prometheus/metrics')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  async metrics(@Res() res: any): Promise<void> {
    try {
      const metrics = await promClient.register.metrics();

      res.set('Content-Type', promClient.register.contentType);
      res.end(metrics);
    } catch (e) {
      throw new InternalServerErrorException('Unable to obtain prometheus metrics');
    }
  }
}
