import * as PromClient from 'prom-client';

import { Controller, Get, Res } from '@nestjs/common';
import { MetricsController as PrometheusMetricsController } from '@mists/nestjs-metrics-prometheus';

@Controller('metrics')
export class MetricsController extends PrometheusMetricsController {
  constructor() {
    super(PromClient.register);
  }

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics(@Res() res: any): void {
    return super.metrics(res);
  }
}
