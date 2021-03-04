import {Errors} from '../errors';
import {Adapter, AdapterKinds, Counter, CountableOptions} from '../interfaces';

export class CounterAdapter implements Counter, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'counter' = 'counter';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableOptions): void {
    throw new Error(Errors.MethodNotImplemented('inc'));
  }

  reset(): void {
    throw new Error(Errors.MethodNotImplemented('reset'));
  }
}
