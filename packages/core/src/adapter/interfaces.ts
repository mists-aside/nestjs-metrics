import {Type} from '@nestjs/common';

export type KIND_COUNTER = 'counter';
export type KIND_GAUGE = 'gauge';
export type KIND_HISTOGRAM = 'histogram';
export type KIND_SUMMARY = 'summary';

export type KIND_METRIC = KIND_COUNTER | KIND_GAUGE | KIND_HISTOGRAM | KIND_SUMMARY;

export interface Tags {
  [key: string]: string | number;
}

export interface TimerMethod {
  (tags?: Tags): void;
}

export interface Counter {
  kind: KIND_COUNTER;
  inc(delta?: number, label?: string, tags?: Tags): void;
}

interface Timer {
  startTimer(label?: string, tags?: Tags): TimerMethod;
}

export interface Gauge extends Timer {
  kind: KIND_GAUGE;
  dec(delta?: number, label?: string, tags?: Tags): void;
  inc(delta?: number, label?: string, tags?: Tags): void;
  set(value: number, label?: string, tags?: Tags): void;
}

export interface Histogram extends Timer {
  kind: KIND_HISTOGRAM;
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}

export interface Summary extends Timer {
  kind: KIND_SUMMARY;
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}

export type AdapterType = Type<Counter | Gauge | Histogram | Summary>;

export type Adapter = Counter | Gauge | Histogram | Summary;
