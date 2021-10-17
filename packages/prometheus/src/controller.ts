import {Config} from '@mists/nestjs-metrics';
import {Res} from '@nestjs/common';
import * as PromClient from 'prom-client';
import {Registry} from 'prom-client';

export class PrometheusController {
  protected config: Config;

  constructor(protected register: Registry) {
    this.config = Config.getInstance();

    PromClient.collectDefaultMetrics({
      register: this.register,
      ...(this.config.instanceLabel && this.config.instanceLabel.length > 0
        ? {labels: {NODE_APP_INSTANCE: this.config.instanceLabel}}
        : {}),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async metrics(@Res() res: any): Promise<void> {
    res.set('Content-Type', PromClient.register.contentType);
    const m = await this.register.metrics();
    res.end(m);
  }
}
