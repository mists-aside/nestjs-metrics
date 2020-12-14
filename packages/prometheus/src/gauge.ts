import { GaugeAbstract, Tags, TimerMethod } from "@mists/nestjs-metrics";
import * as prometheus from 'prom-client';

export interface GaugeFactory {
  (label: string): prometheus.Gauge<string>
}

export class Gauge extends GaugeAbstract {
  protected gauges: { [key: string]: prometheus.Gauge<string> };

  protected factory: GaugeFactory;

  constructor(factory?: GaugeFactory) {
    super();
    this.factory = factory;
  }

  getGauge(label: string): prometheus.Gauge<string> {
    if (!this.gauges[label]) {
      this.gauges[label] = !this.factory ? new prometheus.Gauge<string>({
        name: label,
        help: label
      }) : this.factory(label)
    }
    return this.gauges[label];
  }

  dec(delta?: number, label?: string, tags?: Tags): void {
    return this.getGauge(label).dec(tags, delta)
  }

  inc(delta?: number, label?: string, tags?: Tags): void {
    return this.getGauge(label).inc(tags, delta)
  }

  set(value: number, label?: string, tags?: Tags): void {
    return this.getGauge(label).set(tags, value);
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    return this.getGauge(label).startTimer(tags);
  }

}
