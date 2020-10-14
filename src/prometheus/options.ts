import {
  CounterConfiguration,
  DefaultMetricsCollectorConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
} from 'prom-client';

export type PrometheusMetricOptions =
  | GaugeConfiguration<string>
  | SummaryConfiguration<string>
  | CounterConfiguration<string>
  | HistogramConfiguration<string>;

export interface PrometheusDefaultMetricsOptions {
  enabled?: boolean;
  config: DefaultMetricsCollectorConfiguration;
}

export interface PrometheusOptions {
  // default options options
  defaultMetrics: PrometheusDefaultMetricsOptions;
  // route to read metrics from
  route?: string;
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
