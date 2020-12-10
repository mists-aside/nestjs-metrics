import {Injectable} from '@nestjs/common';

import {Adapter, Gauge as GaugeInterface, Tags, TimerMethod} from '../adapter/interfaces';
import {Metric} from './metric';

@Injectable()
export class Gauge extends Metric {
  protected static instance: Gauge;

  static getInstance(): Gauge {
    if (!Gauge.instance) {
      Gauge.instance = new Gauge();
    }
    return Gauge.instance;
  }

  dec(delta?: number, label?: string, tags?: Tags, adapter?: string): void {
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.dec(delta, label, tags);
    });
  }

  inc(delta?: number, label?: string, tags?: Tags, adapter?: string): void {
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.inc(delta, label, tags);
    });
  }

  set(value: number, label?: string, tags?: Tags, adapter?: string): void {
    this.gaugeAdapters(adapter).forEach((gauge) => {
      gauge.set(value, label, tags);
    });
  }

  startTimer(label?: string, tags?: Tags, adapter?: string): TimerMethod[] {
    return this.gaugeAdapters(adapter).map((gauge) => gauge.startTimer(label, tags));
  }

  protected gaugeAdapters(adapter?: string): GaugeInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'gauge',
    ) as GaugeInterface[];
  }
}
