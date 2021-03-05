import {Provider} from '@nestjs/common';

import {GaugeAdapter} from '../adapters';
import {AdapterKinds, EndTimerMethod, Gauge, TimerOptions} from '../interfaces';
import {CountableMetricOptions, ObservableMetricOptions, MetricOptions} from './counter';
import {Metric} from './metric';

export type TimingMetricOptions = TimerOptions & MetricOptions;

// @Injectable()
export class GaugeMetric extends Metric implements Gauge {
  metricKind: 'gauge' = 'gauge';

  protected static instance: GaugeMetric;

  static getInstance(): GaugeMetric {
    if (!GaugeMetric.instance) {
      GaugeMetric.instance = new GaugeMetric();
    }
    return GaugeMetric.instance;
  }

  static getProvider(): Provider<GaugeMetric> {
    return {
      provide: GaugeMetric,
      useValue: GaugeMetric.getInstance(),
    };
  }

  dec(options?: CountableMetricOptions): void {
    const {adapter, delta, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as CountableMetricOptions;

    const adapters = this.gaugeAdapters(adapter, metric);

    adapters.forEach((gauge) => {
      gauge.dec({delta, tags});
    });
  }

  inc(options?: CountableMetricOptions): void {
    const {adapter, delta, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as CountableMetricOptions;

    const adapters = this.gaugeAdapters(adapter, metric);

    adapters.forEach((gauge) => {
      gauge.inc({delta, tags});
    });
  }

  set(options: ObservableMetricOptions): void {
    const {adapter, delta, metric, tags} = options;

    const adapters = this.gaugeAdapters(adapter, metric);

    adapters.forEach((gauge) => {
      gauge.set({delta, tags});
    });
  }

  startTimer(options?: TimingMetricOptions): EndTimerMethod {
    const {adapter, metric, tags} = {
      ...{
        delta: 1,
      },
      ...(options || {}),
    } as CountableMetricOptions;

    const adapters = this.gaugeAdapters(adapter, metric);

    const endTimers = adapters.map((gauge) => gauge.startTimer({tags}));

    return (options?: TimerOptions) => {
      endTimers.forEach((end) => end(options));
    };
  }

  reset(options?: MetricOptions): void {
    const {adapter, metric} = {...(options || {})}
    this.gaugeAdapters(adapter, metric).forEach((gauge) => {
      gauge.reset();
    });
  }

  protected gaugeAdapters(adapter?: AdapterKinds, metric?: string): GaugeAdapter[] {
    return this.searchAdapters({metricKind: 'gauge'})
      .filter((item) => (adapter ? item.adapter.adapterKind === adapter : true))
      .filter((item) => (metric ? item.metric === metric : true))
      .map((item) => item.adapter as GaugeAdapter);
  }
}
