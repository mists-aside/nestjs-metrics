import {Logger} from '@nestjs/common';

import {AdapterType} from '../adapter';
import {CountableOptions, Counter, LabelOptions} from '../interfaces';

export class MockCounter implements Counter {
  adapterType = AdapterType.Mock;

  logger = new Logger('MockCounter');

  inc(options: CountableOptions): void {
    this.logger.debug(`Counter.inc(${JSON.stringify(options)})`);
  }

  reset(options: LabelOptions): void {
    this.logger.debug(`Counter.reset(${JSON.stringify(options)})`);
  }
}

let mockCounter = new MockCounter();

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jest = require('jest');
  const logger = new Logger('MockCounter/Jest');

  mockCounter = {
    adapterType: AdapterType.Mock,

    inc: jest.fn((options: CountableOptions) => {
      logger.debug(`Counter.inc(${JSON.stringify(options)})`);
    }),

    reset: jest.fn((options: LabelOptions) => {
      logger.debug(`Counter.reset(${JSON.stringify(options)})`);
    }),
  } as MockCounter;
} catch (e) {}

export const defaultMockCounter = mockCounter;
