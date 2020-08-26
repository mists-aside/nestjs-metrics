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
