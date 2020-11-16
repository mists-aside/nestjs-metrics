import * as PromClient from 'prom-client';

import {Config} from '../config';
import {Metrics} from '../enum';
import {metrics} from './dummy';
import {PrometheusMetricOptions} from './options';

/**
 * @ignore
 */
export const getToken = (name: string): string => `PROMETHEUS_METRIC_${name.toUpperCase()}`;

/**
 * @ignore
 */
export const getPrometheusMetric = (type: Metrics, options: PrometheusMetricOptions): PromClient.Metric<string> => {
  const config = Config.getInstance();

  if (!config.prometheus) {
    return metrics[type] as PromClient.Metric<string>;
  }

  const register = config.prometheus
    ? config.prometheus.defaultMetrics.config.register || PromClient.register
    : PromClient.register;

  const existing = register.getSingleMetric(options.name);
  if (existing) {
    return existing;
  }

  let metric: PromClient.Metric<string> = null;
  switch (type) {
    case Metrics.Counter:
      metric = new PromClient.Counter(options);
      break;
    case Metrics.Gauge:
      metric = new PromClient.Gauge(options);
      break;
    case Metrics.Histogram:
      metric = new PromClient.Histogram(options);
      break;
    case Metrics.Summary:
      metric = new PromClient.Summary(options);
      break;
    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
  register.registerMetric(metric);
  return metric;
};
