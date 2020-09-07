import {Metric} from 'prom-client';

import {Provider} from '@nestjs/common';

import {Metrics} from '../enum';
import {PrometheusMetricOptions} from './options';
import {getMetric, getToken} from './utils';

export function makeProvider(type: Metrics, options: PrometheusMetricOptions): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): Metric<string> {
      return getMetric(type, options);
    },
  };
}
