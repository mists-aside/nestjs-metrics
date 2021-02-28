import {AdapterKinds, CounterAdapter, CounterOptions} from '@mists/nestjs-metrics';
import * as StatsdClient from 'statsd-client';

export class StatsdCounterAdapter extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  readonly metricKind: 'counter' = 'counter';

  constructor(protected label: string, protected statsd: StatsdClient) {
    super();
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

    this.statsd.increment(this.label, delta, tags);
  }
}
