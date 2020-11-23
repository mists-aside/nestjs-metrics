import {Injectable} from '@nestjs/common';

import {Counter as CounterInterface, Tags} from '../adapter';
import {Metric} from './metric';

@Injectable()
export class Counter extends Metric implements CounterInterface {
  inc(delta?: number, label?: string, tags?: Tags): void {
    throw new Error('Method not implemented.');
  }
}
