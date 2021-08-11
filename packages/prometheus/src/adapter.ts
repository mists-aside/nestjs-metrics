import {Adapter, Counter} from '@mists/nestjs-metrics';
import {Registry, register} from 'prom-client';

import {PrometheusCounter} from './counter';

export class PrometheusAdapter implements Adapter {
  constructor(public readonly adapterLabel: string, public readonly registries: Registry[] = [register]) {}

  getCounter(): Counter {
    return PrometheusCounter.getInstance(this.adapterLabel);
  }
}
