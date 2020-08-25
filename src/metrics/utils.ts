import {Metrics} from './../metrics';
import {Metric} from './metric';
import {Counter} from './counter';
import {Gauge} from './gauge';
import {CounterConfiguration, GaugeConfiguration, HistogramConfiguration, SummaryConfiguration} from 'prom-client';
import {Tags} from '../config';

export interface CounterOptions {
  prometheus?: Partial<Omit<CounterConfiguration<string>, 'name'>>;
}

export interface GaugeOptions {
  prometheus?: Partial<Omit<GaugeConfiguration<string>, 'name'>>;
  stasd?: Tags;
}

export interface HistogramOptions {
  prometheus?: Partial<Omit<HistogramConfiguration<string>, 'name'>>;
  stasd?: Tags;
}

export interface SummaryOptions extends Omit<HistogramOptions, 'prometheus'> {
  prometheus?: Partial<Omit<SummaryConfiguration<string>, 'name'>>;
}

export type MetricOptions = CounterOptions | GaugeOptions | HistogramOptions | SummaryOptions;

export const getToken = (name): string => `NESTJS_METRIC_${name.toUpperCase()}`;

export const getMetric = (type: Metrics, name: string, options?: MetricOptions): Metric => {
  switch (type) {
    case Metrics.Counter:
      return new Counter(name, options);
    case Metrics.Gauge:
      return new Gauge(name, options);
    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
};
