import {Injectable} from '@nestjs/common';

import {Gauge as GaugeInterface, Tags, TimerMethod} from '../adapter';
import {Metric} from './metric';

@Injectable()
export class Gauge extends Metric {
  set(value: number, label?: string, tags?: Tags, adapter?: string): void {
    throw new Error('Method not implemented.');
  }
  dec(delta?: number, label?: string, tags?: Tags, adapter?: string): void {
    throw new Error('Method not implemented.');
  }
  inc(delta?: number, label?: string, tags?: Tags, adapter?: string): void {
    throw new Error('Method not implemented.');
  }
  startTimer(label?: string, tags?: Tags, adapter?: string): TimerMethod {
    throw new Error('Method not implemented.');
  }
}
