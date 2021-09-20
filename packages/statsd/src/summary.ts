import {EndTimerMethod, MetricOptions, ObservableOptions, Summary, TimerOptions} from '@mists/nestjs-metrics';
import StatsdClient from 'statsd-client';

export class StatsdSummary implements Summary {
  private static instances: Record<string, StatsdSummary> = {};

  constructor(public readonly client: StatsdClient) {}

  static getInstance(client: StatsdClient, adapterLabel = 'default'): StatsdSummary {
    if (!StatsdSummary.instances[adapterLabel]) {
      StatsdSummary.instances[adapterLabel] = new StatsdSummary(client);
    }
    return StatsdSummary.instances[adapterLabel];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  observe(options: ObservableOptions): void {}

  /**
   * StatsdClient has no reset method
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  reset(options: MetricOptions): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options: TimerOptions): EndTimerMethod {
    return () => 0;
  }
}
