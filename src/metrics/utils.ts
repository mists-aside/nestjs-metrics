import {Metrics} from '../enum';
import {Counter} from './counter';
import {Gauge} from './gauge';
import {Histogram} from './histogram';
import {Metric} from './metric';
import {MetricOptions} from './options';
import {Summary} from './summary';

interface MetricInstances {
  [key: string]: Metric;
}

const instances: MetricInstances = {};

export const getToken = (name): string => `NESTJS_METRIC_${name.toUpperCase()}`;

export const getMetric = (type: Metrics, name: string, options?: MetricOptions): Metric => {
  const token = getToken(name);

  if (!instances[token]) {
    switch (type) {
      case Metrics.Counter:
        instances[token] = new Counter(name, options);
        break;
      case Metrics.Gauge:
        instances[token] = new Gauge(name, options);
        break;
      case Metrics.Histogram:
        instances[token] = new Histogram(name, options);
        break;
      case Metrics.Summary:
        instances[token] = new Summary(name, options);
        break;
      default:
        throw new Error(`Unsupported metric type: ${type}`);
    }
  }

  return instances[token];
};

export const getMetricByName = (name: string): Metric => {
  const token = getToken(name);

  if (!instances[token]) {
    throw new Error(`No metric for the name: ${name}. You need to call 'makeMetricProvider'`);
  }

  return instances[token];
};
