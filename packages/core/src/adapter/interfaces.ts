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

export interface AdapterIncOptions {
  delta?: number;
  label?: string;
  tags?: Tags;
}

export interface Counter {
  kind: KIND_COUNTER;
  inc(options?: AdapterIncOptions): void;
}

export interface AdapterStartTimerOptions extends Omit<AdapterIncOptions, 'value'> {}

interface Timer {
  startTimer(options?: AdapterStartTimerOptions): TimerMethod;
}

export interface AdapterDecOptions extends AdapterIncOptions {}

export interface AdapterSetOptions extends Omit<AdapterIncOptions, 'delta'> {
  value?: number;
}

export interface Gauge extends Timer {
  kind: KIND_GAUGE;
  dec(options?: AdapterDecOptions): void;
  inc(options?: AdapterIncOptions): void;
  set(options?: AdapterSetOptions): void;
}

export interface AdapterObserveOptions extends AdapterSetOptions {}

export interface AdapterResetOptions extends Omit<AdapterIncOptions, 'delta'> {}

export interface Histogram extends Timer {
  kind: KIND_HISTOGRAM;
  observe(options?: AdapterObserveOptions): void;
  reset(options?: AdapterResetOptions): void;
}

export interface Summary extends Timer {
  kind: KIND_SUMMARY;
  observe(options?: AdapterObserveOptions): void;
  reset(options?: AdapterResetOptions): void;
}

export type AdapterType = Type<Counter | Gauge | Histogram | Summary>;

export type Adapter = Counter | Gauge | Histogram | Summary;
