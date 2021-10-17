import * as PromClient from 'prom-client';

import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController as PrometheusMetricsController } from '@mists/nestjs-metrics-prometheus';

@Controller('prometheus')
export class PrometheusController extends PrometheusMetricsController {
  constructor() {
    super(PromClient.register);
  }

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async metrics(@Res() res: any): Promise<void> {
    return super.metrics(res);
  }
}
