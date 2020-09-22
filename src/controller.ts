import {Controller, Get, Logger, Res} from '@nestjs/common';
import {Config} from './config';
import * as PromClient from 'prom-client';

@Controller()
export class StatsController {
  constructor() {
    const config = Config.getInstance();
    if (config.prometheus && config.prometheus.defaultMetrics && config.prometheus.defaultMetrics.enabled) {
      PromClient.collectDefaultMetrics(config.prometheus.defaultMetrics.config);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Get()
  metrics(@Res() res: any): void {
    res.set('Content-Type', PromClient.register.contentType);
    res.end(PromClient.register.metrics());
  }
}
