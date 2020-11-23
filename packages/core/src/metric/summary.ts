import {Injectable} from '@nestjs/common';

import {Summary as SummaryInterface, Tags, TimerMethod} from '../adapter';
import {Metric} from './metric';

@Injectable()
export class Summary extends Metric {
  observe(value: number, label?: string, tags?: Tags, adapter?: string): void {
    throw new Error('Method not implemented.');
  }
  reset(label?: string, tags?: Tags, adapter?: string): void {
    throw new Error('Method not implemented.');
  }
  startTimer(label?: string, tags?: Tags, adapter?: string): TimerMethod {
    throw new Error('Method not implemented.');
  }
}
