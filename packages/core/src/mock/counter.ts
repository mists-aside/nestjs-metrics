import {Logger} from '@nestjs/common';

import {CountableOptions, Counter, LabelOptions} from '../interfaces';
import {mlm} from './literals';

export class MockCounter implements Counter {
  public logger = new Logger('MockCounter');

  private static instance: Record<string, MockCounter> = {};

  static getInstance(adapterLabel = ''): MockCounter {
    if (!MockCounter.instance[adapterLabel]) {
      MockCounter.instance[adapterLabel] = new MockCounter();
    }
    return MockCounter.instance[adapterLabel];
  }

  inc(options: CountableOptions): void {
    this.logger.debug(mlm`Counter.inc${options}`);
  }

  reset(options: LabelOptions): void {
    this.logger.debug(mlm`Counter.reset${options}`);
  }
}
