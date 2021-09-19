import {Logger} from '@nestjs/common';

import {EndTimerMethod, Histogram, MetricOptions, ObservableOptions, TimerOptions} from '../interfaces';
import {mlm} from './literals';

export class MockHistogram implements Histogram {
  public logger = new Logger('MockHistogram');

  protected static instance: Record<string, MockHistogram> = {};

  static getInstance(adapterLabel = ''): MockHistogram {
    if (!MockHistogram.instance[adapterLabel]) {
      MockHistogram.instance[adapterLabel] = new MockHistogram();
    }
    return MockHistogram.instance[adapterLabel];
  }

  observe(options: ObservableOptions): void {
    this.logger.debug(mlm`Histogram.observe${options}`);
  }

  startTimer(options?: TimerOptions): EndTimerMethod {
    this.logger.debug(mlm`Histogram.startTimer${options}`);
    return (opts?: TimerOptions) => {
      this.logger.debug(mlm`endTimer${opts}`);
    };
  }

  reset(options: MetricOptions): void {
    this.logger.debug(`Histogram.reset${options}`);
  }
}
