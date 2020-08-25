import { Injectable } from '@nestjs/common';
import * as PromClient from 'prom-client';
import {Counter as CounterInterface, Metric, Metrics, MetricOptions} from './metrics'
import {getPrometheusMetric} from './prometheus';

@Injectable()
export class Counter extends Metric implements CounterInterface {

  constructor(protected options: MetricOptions) {
    super(options)
    if (options.prometheus) {
      this.prometheusMetric = getPrometheusMetric(Metrics.Counter, options.prometheus)
    }
  }

  inc(): void {
    if (this.prometheusMetric) {
      (this.prometheusMetric as PromClient.Counter<string>).inc();
    }
  }
}
