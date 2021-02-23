import {Injectable} from '@nestjs/common';

import {
  Adapter,
  AdapterDecOptions,
  AdapterSetOptions,
  AdapterStartTimerOptions,
  Gauge as GaugeInterface,
  Tags,
  TimerMethod,
} from '../adapter/interfaces';
import {IncOptions} from './counter';
import {Metric} from './metric';

export interface DecOptions extends AdapterDecOptions {
  adapter?: string;
}

export interface SetOptions extends AdapterSetOptions {
  adapter?: string;
}

export interface StartTimerOptions extends AdapterStartTimerOptions {
  adapter?: string;
}

@Injectable()
export class Gauge extends Metric {
  protected static instance: Gauge;

  static getInstance(): Gauge {
    if (!Gauge.instance) {
      Gauge.instance = new Gauge();
    }
    return Gauge.instance;
  }

  dec(options?: DecOptions): void {
    const {adapter, delta, label, tags} = Object.assign(
      {
        delta: 1,
      },
      options || {},
    );
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.dec({delta, label, tags});
    });
  }

  inc(options?: IncOptions): void {
    const {adapter, delta, label, tags} = Object.assign(
      {
        delta: 1,
      },
      options || {},
    );
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.inc({delta, label, tags});
    });
  }

  set(options?: SetOptions): void {
    const {adapter, label, tags, value} = Object.assign(
      {
        value: 1,
      },
      options || {},
    );
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.set({value, label, tags});
    });
  }

  startTimer(options?: StartTimerOptions): TimerMethod[] {
    const {adapter, label, tags} = Object.assign({}, options || {});
    return this.gaugeAdapters(adapter).map((gauge) => gauge.startTimer({label, tags}));
  }

  protected gaugeAdapters(adapter?: string): GaugeInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'gauge',
    ) as GaugeInterface[];
  }
}
