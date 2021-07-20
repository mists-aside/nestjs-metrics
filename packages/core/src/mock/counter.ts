import {Logger} from '@nestjs/common';

import {CountableOptions, Counter, LabelOptions} from '../interfaces';

export class MockCounter implements Counter {
  private logger = new Logger('MockCounter');

  static getInstance(): MockCounter {
    return new MockCounter();
  }

  inc(options: CountableOptions): void {
    this.logger.debug(`Counter.inc(${JSON.stringify(options)})`);
  }

  reset(options: LabelOptions): void {
    this.logger.debug(`Counter.reset(${JSON.stringify(options)})`);
  }
}
