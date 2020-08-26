import {Provider} from '@nestjs/common';
import {Metrics} from '../enum';
import {PrometheusMetricOptions, getToken, getPrometheusMetric} from './utils';
import {Metric} from 'prom-client';

export function makePrometheusProvider(type: Metrics, options: PrometheusMetricOptions): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): Metric<string> {
      return getPrometheusMetric(type, options);
    },
  };
}
