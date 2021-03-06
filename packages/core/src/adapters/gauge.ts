import {Errors} from '../errors';
import {
  Adapter,
  AdapterKinds,
  CountableOptions,
  EndTimerMethod,
  Gauge,
  ObservableOptions,
  TimerOptions,
} from '../interfaces';

export class GaugeAdapter implements Gauge, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'gauge' = 'gauge';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dec(options?: CountableOptions): void {
    throw new Error(Errors.MethodNotImplemented('dec'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableOptions): void {
    throw new Error(Errors.MethodNotImplemented('inc'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options: ObservableOptions): void {
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
