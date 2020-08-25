import {Controller, Get, InternalServerErrorException, Logger, Res} from '@nestjs/common';
import {Config} from './config';
import * as PromClient from 'prom-client';

@Controller()
export class StatsController {
  constructor(private config: Config, private logger: Logger) {
    if (true) {
      // Get('/metrics')(this.metrics)
    }
  }

  @Get('/metrics')
  async metrics(@Res() res: any) {
    res.set('Content-Type', PromClient.register.contentType);
    res.end(PromClient.register.metrics());
  }
}
