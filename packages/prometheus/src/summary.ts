import {SummaryAbstract, Tags, TimerMethod} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

export interface SummaryFactory {
  (label: string): prometheus.Summary<string>;
}

export class Summary extends SummaryAbstract {
  protected summaries: {[key: string]: prometheus.Summary<string>};

  protected factory: SummaryFactory;

  constructor(factory?: SummaryFactory) {
    super();
    this.factory = factory;
  }

  getSummary(label: string): prometheus.Summary<string> {
    if (!this.summaries[label]) {
      this.summaries[label] = !this.factory
        ? new prometheus.Summary<string>({
            name: label,
            help: label,
          })
        : this.factory(label);
    }
    return this.summaries[label];
  }

  observe(value: number, label?: string, tags?: Tags): void {
    return this.getSummary(label).observe(tags, value);
  }

  reset(label?: string, tags?: Tags): void {
    return this.getSummary(label).reset();
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    return this.getSummary(label).startTimer(tags);
  }
}
