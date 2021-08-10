import {Adapter, Counter} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

import {StatsdCounter} from './counter';

export class StatsdAdapter implements Adapter {
  constructor(public readonly adapterLabel: string, public readonly client: StatsdClient) {}

  getCounter(): Counter {
    return StatsdCounter.getInstance(this.client, this.adapterLabel);
  }
}
