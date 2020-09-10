/* eslint-disable @typescript-eslint/no-explicit-any */

import {Tags} from '../options';

export interface StatsdClientAlike {
  counter(metric: string, delta: number, tags?: Tags): this;
  increment(metric: string, delta?: number, tags?: Tags): this;
  decrement(metric: string, delta?: number, tags?: Tags): this;
  gauge(name: string, value: number, tags?: Tags): this;
  gaugeDelta(name: string, delta: number, tags?: Tags): this;
  set(name: string, value: number, tags?: Tags): this;
  timing(name: string, startOrDuration: Date | number, tags?: Tags): this;
  histogram(name: string, value: number, tags?: Tags): this;
}

export type StatsdOptions = {[key: string]: any} | 'dummy';
