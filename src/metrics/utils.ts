import { Metrics } from '../metrics';
import { Counter } from './counter';
import { Gauge } from './gauge';
import { Histogram } from './histogram';
import { Metric } from './metric';
import { MetricOptions } from './options';
import { Summary } from './summary';

export const getToken = (name): string => `NESTJS_METRIC_${name.toUpperCase()}`;

export const getMetric = (type: Metrics, name: string, options?: MetricOptions): Metric => {
  switch (type) {
    case Metrics.Counter:
      return new Counter(name, options);
    case Metrics.Gauge:
      return new Gauge(name, options);
    case Metrics.Histogram:
      return new Histogram(name, options);
    case Metrics.Summary:
      return new Summary(name, options);
    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
};
