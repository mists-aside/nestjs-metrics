import {Metrics} from '../enum';
import {Metric, Timer} from './metric';
import {GaugeOptions} from './options';
import {Tags} from '../config';

export class Gauge extends Metric {
  public startTimer: (tags?: Tags) => () => void;

  constructor(name: string, options?: GaugeOptions) {
    super(name, Metrics.Gauge, options);
  }

  dec(value = 1, tags?: Tags): void {
    this.prometheusMetric.dec(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, value);
  }

  inc(value = 1, tags?: Tags): void {
    this.prometheusMetric.inc(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, value);
  }

  set(value: number, tags?: Tags): void {
    this.prometheusMetric.set(tags || {}, value);
    this.statsdClient.gauge(this.statsdName, value, this.options.stasd || {});
  }
}

Gauge.prototype.startTimer = Timer.prototype.startTimer;
