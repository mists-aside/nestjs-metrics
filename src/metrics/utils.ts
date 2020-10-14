import {Metrics} from '../enum';
import {Counter} from './counter';
import {Gauge} from './gauge';
import {Histogram} from './histogram';
import {Metric} from './generic';
import {MetricOptions} from './options';
import {Summary} from './summary';

interface MetricInstances {
  [key: string]: Metric;
}

/**
 * @ignore
 */
const instances: MetricInstances = {};

/**
 * @ignore
 */
export const getToken = (name): string => `NESTJS_METRIC_${name.toUpperCase()}`;

/**
 * @ignore
 */
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
