import {Adapter, Counter, Gauge, Histogram, Summary} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

import {StatsdCounter} from './counter';
import {StatsdGauge} from './gauge';
import {StatsdHistogram} from './histogram';
import {StatsdSummary} from './summary';

export class StatsdAdapter implements Adapter {
  constructor(public readonly adapterLabel: string, public readonly client: StatsdClient) {}

  getCounter(): Counter {
    return StatsdCounter.getInstance(this.client, this.adapterLabel);
  }

  getGauge(): Gauge {
    return StatsdGauge.getInstance(this.client, this.adapterLabel);
  }

  getHistogram(): Histogram {
    return StatsdHistogram.getInstance(this.client, this.adapterLabel);
  }

  getSummary(): Summary {
    return StatsdSummary.getInstance(this.client, this.adapterLabel);
  }
}
