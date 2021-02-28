import {Errors} from '../errors';
import {Adapter, AdapterKinds, Counter, CounterOptions} from '../interfaces';

export class CounterAdapter implements Counter, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'counter' = 'counter';

  /**
   * @see Counter.inc()
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CounterOptions): void {
    throw new Error(Errors.MethodNotImplemented('inc'));
  }
}
