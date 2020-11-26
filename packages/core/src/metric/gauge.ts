import {Injectable} from '@nestjs/common';

import {Adapter, Gauge as GaugeInterface, Tags, TimerMethod} from '../adapter';
import {Metric} from './metric';

@Injectable()
export class Gauge extends Metric {
  protected gaugeAdapters(adapter?: string): GaugeInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'gauge',
    ) as GaugeInterface[];
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
}
