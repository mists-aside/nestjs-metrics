import {CountableOptions, Counter, MetricOptions} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

export class StatsdCounter implements Counter {
  private static instances: Record<string, StatsdCounter> = {};

  constructor(public readonly client: StatsdClient) {}

  static getInstance(client: StatsdClient, adapterLabel = 'default'): StatsdCounter {
    if (!StatsdCounter.instances[adapterLabel]) {
      StatsdCounter.instances[adapterLabel] = new StatsdCounter(client);
    }
    return StatsdCounter.instances[adapterLabel];
  }

  inc(options: CountableOptions): void {
    const {labels, delta, tags} = options;
    labels.forEach((label: string) => this.client.increment(label, delta ? delta : 1, tags));
  }

  /**
   * StatsdClient has no reset method
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  reset(options: MetricOptions): void {}
}
