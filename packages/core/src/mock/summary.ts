import {Logger} from '@nestjs/common';

import {EndTimerMethod, MetricOptions, ObservableOptions, Summary, TimerOptions} from '../interfaces';
import {mlm} from './literals';

export class MockSummary implements Summary {
  public logger = new Logger('MockSummary');

  protected static instance: Record<string, MockSummary> = {};

  static getInstance(adapterLabel = ''): MockSummary {
    if (!MockSummary.instance[adapterLabel]) {
      MockSummary.instance[adapterLabel] = new MockSummary();
    }
    return MockSummary.instance[adapterLabel];
  }

  observe(options: ObservableOptions): void {
    this.logger.debug(mlm`Summary.observe${options}`);
  }

  startTimer(options?: TimerOptions): EndTimerMethod {
    this.logger.debug(mlm`Summary.startTimer${options}`);
    return (opts?: TimerOptions) => {
      this.logger.debug(mlm`endTimer${opts}`);
      return 0;
    };
  }

  reset(options: MetricOptions): void {
    this.logger.debug(`Summary.reset${options}`);
  }
}
