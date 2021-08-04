import {CountableOptions, Counter, LabelOptions, Tags} from '@mists/nestjs-metrics';

import * as StatsdClient from 'statsd-client';

export class StatsdCounter implements Counter {
  private static instance: Record<string, StatsdCounter> = {};

  constructor(public readonly client: StatsdClient) {}

  static getInstance(client: StatsdClient, adapterLabel = ''): StatsdCounter {
    if (!StatsdCounter.instance[adapterLabel]) {
      StatsdCounter.instance[adapterLabel] = new StatsdCounter(client);
    }
    return StatsdCounter.instance[adapterLabel];
  }

  inc(options: CountableOptions): void {
    options.labels.forEach((label: string) => this.client.inc(label, options.delta, options.tags));
  }

  reset(options: LabelOptions): void {
    options.labels.forEach((label: string) => this.client.reset());
  }
}
