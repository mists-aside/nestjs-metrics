import {HistogramAbstract, Tags, TimerMethod} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

export interface HistogramFactory {
  (label: string): prometheus.Histogram<string>;
}

export class Histogram extends HistogramAbstract {
  protected histograms: {[key: string]: prometheus.Histogram<string>};

  protected factory: HistogramFactory;

  constructor(factory?: HistogramFactory) {
    super();
    this.factory = factory;
  }

  getHistogram(label: string): prometheus.Histogram<string> {
    if (!this.histograms[label]) {
      this.histograms[label] = !this.factory
        ? new prometheus.Histogram<string>({
            name: label,
            help: label,
          })
        : this.factory(label);
    }
    return this.histograms[label];
  }

  observe(value: number, label?: string, tags?: Tags): void {
    return this.getHistogram(label).observe(tags, value);
  }

  reset(label?: string, tags?: Tags): void {
    return this.getHistogram(label).reset();
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    return this.getHistogram(label).startTimer(tags);
  }
}
