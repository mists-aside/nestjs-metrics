import {Adapter, Counter} from '@mists/nestjs-metrics';

import {PrometheusCounter} from './counter';

export class PrometheusAdapter implements Adapter {
  constructor(public readonly adapterLabel: string) {}

  getCounter(): Counter {
    return PrometheusCounter.getInstance(this.adapterLabel);
  }
}
