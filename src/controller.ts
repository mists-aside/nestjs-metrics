import {Controller, Logger, Res} from '@nestjs/common';
import {Config} from './config';
import * as PromClient from 'prom-client';

@Controller()
export class StatsController {
  constructor(private config: Config, private logger: Logger) {
    // if (true) {
    //   // Get('/metrics')(this.metrics)
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics(@Res() res: any): void {
    res.set('Content-Type', PromClient.register.contentType);
    res.end(PromClient.register.metrics());
  }
}
