import {Injectable} from '@nestjs/common';

import {Adapter, Histogram as HistogramInterface, Tags, TimerMethod} from '../adapter/interfaces';
import {Metric} from './metric';

@Injectable()
export class Histogram extends Metric {
  protected static instance: Histogram;

  static getInstance(): Histogram {
    if (!Histogram.instance) {
      Histogram.instance = new Histogram();
    }
    return Histogram.instance;
  }

  observe(value: number, label?: string, tags?: Tags, adapter?: string): void {
    this.histogramAdapters(adapter).forEach((histogram) => histogram.observe(value, label, tags));
  }

  reset(label?: string, tags?: Tags, adapter?: string): void {
    this.histogramAdapters(adapter).forEach((histogram) => histogram.reset(label, tags));
  }

  startTimer(label?: string, tags?: Tags, adapter?: string): TimerMethod[] {
    return this.histogramAdapters(adapter).map((histogram) => histogram.startTimer(label, tags));
  }

  protected histogramAdapters(adapter?: string): HistogramInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'histogram',
    ) as HistogramInterface[];
  }
}
