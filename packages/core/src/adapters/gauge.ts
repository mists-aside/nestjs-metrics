import {Errors} from '../errors';
import {Adapter, AdapterKinds, CounterOptions, EndTimerMethod, Gauge, TimerOptions} from '../interfaces';

export class GaugeAdapter implements Gauge, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'gauge' = 'gauge';

  /**
   * @see Gauge.dec()
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dec(options?: CounterOptions): void {
    throw new Error(Errors.MethodNotImplemented('dec'));
  }

  /**
   * @see Gauge.inc()
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CounterOptions): void {
    throw new Error(Errors.MethodNotImplemented('inc'));
  }

  /**
   * @see Gauge.set()
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options?: CounterOptions): void {
    throw new Error(Errors.MethodNotImplemented('set'));
  }

  /**
   * @see Gauge.startTimer()
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    throw new Error(Errors.MethodNotImplemented('startTimer'));
  }
}
