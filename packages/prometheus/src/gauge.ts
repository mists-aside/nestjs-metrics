import {GaugeAbstract, Tags, TimerMethod} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

import {PrometheusInvalidLabelError} from './errors';
import {Trait} from './trait';

export interface GaugeFactory {
  (label: string, availableTagKeys?: string[]): prometheus.Gauge<string>;
}

export class Gauge extends GaugeAbstract {
  protected metrics: {[key: string]: prometheus.Gauge<string>} = {};

  protected factory: GaugeFactory;
  protected availableTagKeys: string[];

  constructor(availableTagKeys: string[] = [], factory?: GaugeFactory) {
    super();
    this.availableTagKeys = availableTagKeys;
    this.factory = factory;
  }

  // formLabel(label: string) {
  //   return `${label}::${this.availableTagKeys.join('|')}`;
  // }

  getGauge(label: string): prometheus.Gauge<string> {
    const localLabel = (this as any).formLabel(label);

    return (this as any).getMetric(
      label,
      {
        name: localLabel,
        help: `Gauge for ${localLabel}`,
        labelNames: this.availableTagKeys,
      },
      prometheus.Gauge,
    ) as prometheus.Gauge<string>;

    // const localLabel = this.formLabel(label);

    // if (!this.gauges[localLabel]) {
    //   this.gauges[localLabel] = this.factory
    //     ? this.factory(localLabel, this.availableTagKeys)
    //     : new prometheus.Gauge<string>({
    //         name: localLabel,
    //         help: `Gauge for ${localLabel}`,
    //         labelNames: this.availableTagKeys,
    //       });
    // }
    // return this.gauges[localLabel];
  }

  dec(delta?: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getGauge(label).dec(tags, delta);
  }

  inc(delta?: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getGauge(label).inc(tags, delta);
  }

  set(value: number, label?: string, tags?: Tags): void {
    if (!label) {
      throw new PrometheusInvalidLabelError();
    }
    return this.getGauge(label).set(tags, value);
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    return this.getGauge(label).startTimer(tags);
  }
}

Object.getOwnPropertyNames(Trait.prototype).forEach((key) => {
  Gauge.prototype[key] = Trait.prototype[key];
});
