import {Provider} from '@nestjs/common';

import {Config} from '../config';
import {Metrics} from '../enum';
import {Metric} from './generic';
import {MetricOptions} from './options';
import {getMetric, getToken} from './utils';

export const makeMetricProvider = (type: Metrics, name: string, options?: MetricOptions): Provider => {
  if (!options.statsd) {
    options = {
      ...options,
      statsd: Config.getInstance().statsd || 'dummy',
    };
  }
  return {
    provide: getToken(name),
    useFactory(): Metric {
      return getMetric(type, name, options);
    },
  };
};
