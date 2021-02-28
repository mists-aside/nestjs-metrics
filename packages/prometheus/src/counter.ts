import {AdapterKinds, CounterAdapter, CounterOptions} from '@mists/nestjs-metrics';
import * as prometheus from 'prom-client';

export class PrometheusCounterAdapter extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  readonly metricKind: 'counter' = 'counter';

  protected promCounter: prometheus.Counter<string>;

  constructor(configuration: prometheus.CounterConfiguration<string>) {
    super();
    this.promCounter = new prometheus.Counter<string>(configuration);
  }

  /**
   * @see Counter.inc()
   * @param options
   */
  inc(options?: CounterOptions): void {
    const {delta, tags} = {
      ...{
        delta: 1,
        tags: {},
      },
      ...(options || {}),
    };

    this.promCounter.inc(tags, delta);
  }

  getPromCounter(): prometheus.Counter<string> {
    return this.promCounter;
  }
}
