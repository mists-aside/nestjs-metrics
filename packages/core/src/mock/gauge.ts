import {Logger} from '@nestjs/common';

import {CountableOptions, EndTimerMethod, Gauge, MetricOptions, ObservableOptions, TimerOptions} from '../interfaces';
import {mlm} from './literals';

export class MockGauge implements Gauge {
  public logger = new Logger('MockGauge');

  protected static instance: Record<string, MockGauge> = {};

  static getInstance(adapterLabel = ''): MockGauge {
    if (!MockGauge.instance[adapterLabel]) {
      MockGauge.instance[adapterLabel] = new MockGauge();
    }
    return MockGauge.instance[adapterLabel];
  }

  dec(options?: CountableOptions): void {
    this.logger.debug(mlm`Gauge.dec${options}`);
  }

  inc(options?: CountableOptions): void {
    this.logger.debug(mlm`Gauge.inc${options}`);
  }

  set(options: ObservableOptions): void {
    this.logger.debug(mlm`Gauge.set${options}`);
  }

  startTimer(options?: TimerOptions): EndTimerMethod {
    this.logger.debug(mlm`Gauge.startTimer${options}`);
    return (opts?: TimerOptions) => {
      this.logger.debug(mlm`endTimer${opts}`);
    };
  }
}
