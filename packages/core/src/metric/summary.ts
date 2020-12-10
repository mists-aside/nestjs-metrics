import {Injectable} from '@nestjs/common';

import {Adapter, Summary as SummaryInterface, Tags, TimerMethod} from '../adapter/interfaces';
import {Metric} from './metric';

@Injectable()
export class Summary extends Metric {
  protected static instance: Summary;

  static getInstance(): Summary {
    if (!Summary.instance) {
      Summary.instance = new Summary();
    }
    return Summary.instance;
  }

  observe(value: number, label?: string, tags?: Tags, adapter?: string): void {
    this.summaryAdapters(adapter).forEach((Summary) => Summary.observe(value, label, tags));
  }

  reset(label?: string, tags?: Tags, adapter?: string): void {
    this.summaryAdapters(adapter).forEach((Summary) => Summary.reset(label, tags));
  }

  startTimer(label?: string, tags?: Tags, adapter?: string): TimerMethod[] {
    return this.summaryAdapters(adapter).map((Summary) => Summary.startTimer(label, tags));
  }

  protected summaryAdapters(adapter?: string): SummaryInterface[] {
    return this.searchAdapters(
      adapter ? adapter : (value: Adapter): unknown => value.kind === 'summary',
    ) as SummaryInterface[];
  }
}
