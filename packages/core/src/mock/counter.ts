import {Logger} from '@nestjs/common';

import {CountableOptions, Counter, LabelOptions} from '../interfaces';
import {mlm} from './literals';

export class MockCounter implements Counter {
  public logger = new Logger('MockCounter');

  private static instance: MockCounter;

  static getInstance(): MockCounter {
    if (!MockCounter.instance) {
      MockCounter.instance = new MockCounter();
    }
    return MockCounter.instance;
  }

  inc(options: CountableOptions): void {
    this.logger.debug(mlm`Counter.inc${options}`);
  }

  reset(options: LabelOptions): void {
    this.logger.debug(mlm`Counter.reset${options}`);
  }
}
