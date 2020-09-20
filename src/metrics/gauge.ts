import {Metrics} from '../enum';
import {Metric, Timer} from './generic';
import {GaugeOptions} from './options';
import {Tags} from '../options';

export class Gauge extends Metric {
  public startTimer: (tags?: Tags) => () => void;

  constructor(name: string, options?: GaugeOptions) {
    super(name, Metrics.Gauge, options);
  }

  dec(value = 1, tags?: Tags): void {
    console.log('Gauge.dec', value, tags);
    this.prometheusMetric.dec(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, -value, tags || {});
  }

  inc(value = 1, tags?: Tags): void {
    console.log('Gauge.inc', value, tags);
    this.prometheusMetric.inc(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, value, tags || {});
  }

  set(value: number, tags?: Tags): void {
    this.prometheusMetric.set(tags || {}, value);
    this.statsdClient.gauge(this.statsdName, value, tags || {});
  }
}

Gauge.prototype.startTimer = Timer.prototype.startTimer;
