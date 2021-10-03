import {Controller, Get, Res} from '@nestjs/common';
import * as PromClient from 'prom-client';
import {Registry} from 'prom-client';

@Controller()
export class MetricsController {
  constructor(register: Registry) {
    PromClient.collectDefaultMetrics({register});
  }

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics(@Res() res: any): void {
    res.set('Content-Type', PromClient.register.contentType);
    res.end(PromClient.register.metrics());
  }
}
