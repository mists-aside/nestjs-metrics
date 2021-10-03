import {Adapter, Counter, Gauge, Histogram, Summary} from '@mists/nestjs-metrics';
import {Registry, register} from 'prom-client';

import {PrometheusCounter} from './counter';
import {PrometheusGauge} from './gauge';
import {PrometheusHistogram} from './histogram';
import {PrometheusSummary} from './summary';

export class PrometheusAdapter implements Adapter {
  constructor(public readonly adapterLabel: string, public readonly registries: Registry[] = [register]) {}

  getCounter(): Counter {
    return PrometheusCounter.getInstance(this.adapterLabel);
  }

  getGauge(): Gauge {
    return PrometheusGauge.getInstance(this.adapterLabel);
  }

  getHistogram(): Histogram {
    return PrometheusHistogram.getInstance(this.adapterLabel);
  }

  getSummary(): Summary {
    return PrometheusSummary.getInstance(this.adapterLabel);
  }
}
