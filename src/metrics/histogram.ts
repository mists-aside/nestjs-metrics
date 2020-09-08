import {Tags} from '../options';
import {Metrics} from '../enum';
import {Metric, Timer} from './generic';
import {HistogramOptions} from './options';

export class Histogram extends Metric {
  public startTimer: (tags?: Tags) => () => void;

  constructor(name: string, options?: HistogramOptions) {
    super(name, Metrics.Histogram, options);
  }

  observe(value: number, tags?: Tags): void {
    this.prometheusMetric.observe(tags || {}, value);
    this.statsdClient.histogram(this.statsdName, value, tags || {});
  }

  reset(): void {
    this.prometheusMetric.reset();
    this.statsdClient.histogram(this.statsdName, 0);
  }
}

Histogram.prototype.startTimer = Timer.prototype.startTimer;
