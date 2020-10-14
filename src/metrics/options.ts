import {StatsDOptions} from '../statsd/options';
import {CounterConfiguration, GaugeConfiguration, HistogramConfiguration, SummaryConfiguration} from 'prom-client';

export interface CounterOptions {
  prometheus?: Partial<Omit<CounterConfiguration<string>, 'name'>>;
  statsd?: StatsDOptions;
}

export interface GaugeOptions extends Omit<CounterOptions, 'prometheus'> {
  prometheus?: Partial<Omit<GaugeConfiguration<string>, 'name'>>;
}

export interface HistogramOptions extends Omit<CounterOptions, 'prometheus'> {
  prometheus?: Partial<Omit<HistogramConfiguration<string>, 'name'>>;
}

export interface SummaryOptions extends Omit<CounterOptions, 'prometheus'> {
  prometheus?: Partial<Omit<SummaryConfiguration<string>, 'name'>>;
}

export type MetricOptions = CounterOptions | GaugeOptions | HistogramOptions | SummaryOptions;
