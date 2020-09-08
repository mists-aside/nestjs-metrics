import {Metric} from 'prom-client';

import {Provider} from '@nestjs/common';

import {Metrics} from '../enum';
import {PrometheusMetricOptions} from './options';
import {getPrometheusMetric, getToken} from './utils';

export function makeProvider(type: Metrics, options: PrometheusMetricOptions): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): Metric<string> {
      return getPrometheusMetric(type, options);
    },
  };
}
