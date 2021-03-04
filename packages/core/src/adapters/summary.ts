import { Summary } from './../interfaces';
import {Errors} from '../errors';
import {Adapter, AdapterKinds, ObservableOptions, EndTimerMethod, TimerOptions} from '../interfaces';

export class SummaryAdapter implements Summary, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'summary' = 'summary';

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
