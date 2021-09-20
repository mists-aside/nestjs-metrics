import {EndTimerMethod, Histogram, MetricOptions, ObservableOptions, TimerOptions} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

export class StatsdHistogram implements Histogram {
  private static instances: Record<string, StatsdHistogram> = {};

  constructor(public readonly client: StatsdClient) {}

  static getInstance(client: StatsdClient, adapterLabel = 'default'): StatsdHistogram {
    if (!StatsdHistogram.instances[adapterLabel]) {
      StatsdHistogram.instances[adapterLabel] = new StatsdHistogram(client);
    }
    return StatsdHistogram.instances[adapterLabel];
  }

  observe(options: ObservableOptions): void {
    const {labels, delta, tags} = options;
    labels.forEach((label: string) => this.client.histogram(label, delta, tags));
  }

  /**
   * StatsdClient has no reset method
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  reset(options: MetricOptions): void {}

  startTimer(options: TimerOptions): EndTimerMethod {
    const start = new Date();
    const {labels, tags} = options;
    return (opts?: TimerOptions) => {
      return Math.trunc(
        labels
          .map((label: string) => this.client.timing(label, start, opts ? opts.tags || tags : tags))
          .reduce((a) => a + new Date().getTime() - start.getTime(), 0) / labels.length,
      );
    };
  }
}
