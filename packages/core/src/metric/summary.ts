import { Injectable } from '@nestjs/common';

import { Summary as SummaryInterface, Tags, TimerMethod } from '../adapter';
import { Metric } from './metric';

@Injectable()
export class Summary extends Metric implements SummaryInterface {
  observe(value: number, label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
  reset(label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
  startTimer(label?: string, tags?: Tags): TimerMethod {
    throw new Error('Method not implemented.');
  }
}
