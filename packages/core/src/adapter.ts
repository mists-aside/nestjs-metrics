import {Type} from '@nestjs/common';

export interface Tags {
  [key: string]: string | number;
}

export interface TimerMethod {
  (tags?: Tags): void;
}

export interface Counter {
  kind: 'counter';
  inc(delta?: number, label?: string, tags?: Tags): void;
}

interface Timer {
  startTimer(label?: string, tags?: Tags): TimerMethod;
}

export interface Gauge extends Timer {
  kind: 'gauge';
  dec(delta?: number, label?: string, tags?: Tags): void;
  inc(delta?: number, label?: string, tags?: Tags): void;
  set(value: number, label?: string, tags?: Tags): void;
}

export interface Histogram extends Timer {
  kind: 'histogram';
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}

export interface Summary extends Timer {
  kind: 'summary';
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}

export type AdapterType = Type<Counter | Gauge | Histogram | Summary>;

export type Adapter = Counter | Gauge | Histogram | Summary;
