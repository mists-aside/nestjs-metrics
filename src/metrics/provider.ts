import {Provider} from '@nestjs/common';
import {Metric} from './metric';
import {Metrics} from '../metrics';
import {MetricOptions, getMetric, getToken} from './utils';

export const makeMetricProvider = (type: Metrics, name: string, options?: MetricOptions): Provider => {
  return {
    provide: getToken(name),
    useFactory(): Metric {
      return getMetric(type, name, options);
    },
  };
};
