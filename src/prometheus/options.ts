import {
  CounterConfiguration,
  DefaultMetricsCollectorConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
} from 'prom-client';

export interface PrometheusDefaultMetricsOptions {
  enabled?: boolean;
  config: DefaultMetricsCollectorConfiguration;
}

export interface PrometheusOptions {
  // default values for counter metric
  counter?: Partial<Omit<CounterConfiguration<string>, 'name' | 'help'>>;
  // default options options
  defaultMetrics: PrometheusDefaultMetricsOptions;
  // default options for gauge metric
  gauge?: Partial<Omit<GaugeConfiguration<string>, 'name' | 'help'>>;
  // default options for histogram metric
  histogram?: Partial<Omit<HistogramConfiguration<string>, 'name' | 'help'>>;
  // route to read metrics from
  route?: string;
  // default options for summary metric
  summary?: Partial<Omit<SummaryConfiguration<string>, 'name' | 'help'>>;
}

export const defaultPrometheusOptions: PrometheusOptions = {
  defaultMetrics: {
    enabled: true,
    config: {
      // register: require('prom-client').register
    },
  },
  route: '/metrics',
};
