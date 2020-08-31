import {Provider} from '@nestjs/common';
import {Metric} from './metric';
import {Metrics} from '../enum';
import {getMetric, getToken} from './utils';
import {MetricOptions} from './options';

export const makeMetricProvider = (type: Metrics, name: string, options?: MetricOptions): Provider => {
  return {
    provide: getToken(name),
    useFactory(): Metric {
      return getMetric(type, name, options);
    },
  };
};
