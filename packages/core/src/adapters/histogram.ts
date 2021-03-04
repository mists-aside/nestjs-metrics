import {Errors} from '../errors';
import {Adapter, AdapterKinds, ObservableOptions, EndTimerMethod, Histogram, TimerOptions} from '../interfaces';

export class HistogramAdapter implements Histogram, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'histogram' = 'histogram';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(options: ObservableOptions): void {
    throw new Error(Errors.MethodNotImplemented('set'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    throw new Error(Errors.MethodNotImplemented('startTimer'));
  }

  reset(): void {
    throw new Error(Errors.MethodNotImplemented('reset'));
  }
}
