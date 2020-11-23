import {Injectable} from '@nestjs/common';

import {Gauge as GaugeInterface, Tags, TimerMethod} from '../adapter';
import {Metric} from './metric';

@Injectable()
export class Gauge extends Metric implements GaugeInterface {
  set(value: number, label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
  dec(delta?: number, label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
  inc(delta?: number, label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
  startTimer(label?: string, tags?: Tags): TimerMethod {
    throw new Error('Method not implemented.');
  }
}
