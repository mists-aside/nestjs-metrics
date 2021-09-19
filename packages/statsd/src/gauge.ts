import {CountableOptions, EndTimerMethod, Gauge, MetricOptions, TimerOptions} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

export class StatsdGauge implements Gauge {
  private static instances: Record<string, StatsdGauge> = {};

  constructor(public readonly client: StatsdClient) {}

  static getInstance(client: StatsdClient, adapterLabel = 'default'): StatsdGauge {
    if (!StatsdGauge.instances[adapterLabel]) {
      StatsdGauge.instances[adapterLabel] = new StatsdGauge(client);
    }
    return StatsdGauge.instances[adapterLabel];
  }

  dec(options: CountableOptions): void {
    const {labels, delta, tags} = options;
    labels.forEach((label: string) => this.client.gaugeDelta(label, -1 * (delta ? delta : 1), tags));
  }

  inc(options: CountableOptions): void {
    const {labels, delta, tags} = options;
    labels.forEach((label: string) => this.client.gaugeDelta(label, delta ? delta : 1, tags));
  }

  /**
   * StatsdClient has no reset method
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  reset(options: MetricOptions): void {}

  set(options: CountableOptions): void {
    const {labels, delta, tags} = options;
    labels.forEach((label: string) => this.client.gauge(label, delta ? delta : 1, tags));
  }

  startTimer(options: TimerOptions): EndTimerMethod {
    const start = new Date();
    const {labels, tags} = options;
    return (opts?: TimerOptions) => {
      labels.forEach((label: string) => this.client.timing(label, start, opts ? opts.tags || tags : tags));
    };
  }
}
