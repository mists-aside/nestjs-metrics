/* eslint-disable @typescript-eslint/no-unused-vars */

import {Errors} from '../errors';
import {Adapter, AdapterKinds, CounterOptions, Counter} from '../interfaces';

export class CounterAdapter implements Counter, Adapter {
  adapterKind: AdapterKinds;

  readonly metricKind: 'counter' = 'counter';

  /**
   * @see Counter.inc()
   * @param options
   */
  inc(options?: CounterOptions): void {
    throw new Error(Errors.MethodNotImplemented('inc'));
  }
}

// import {
//   AdapterDecOptions,
//   AdapterIncOptions,
//   AdapterObserveOptions,
//   AdapterResetOptions,
//   AdapterStartTimerOptions,
//   Counter as CounterInterface,
//   Gauge as GaugeInterface,
//   Histogram as HistogramInterface,
//   KIND_COUNTER,
//   KIND_GAUGE,
//   KIND_HISTOGRAM,
//   KIND_SUMMARY,
//   Summary as SummaryInterface,
//   TimerMethod,
// } from './interfaces';

// const ERROR_MESSAGE = 'Method {method} was not implemented yet.';

// export class Counter implements CounterInterface {
//   public kind = 'counter' as KIND_COUNTER;

//   inc(options?: AdapterIncOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'inc'));
//   }
// }

// export class Gauge implements GaugeInterface {
//   kind = 'gauge' as KIND_GAUGE;

//   dec(options?: AdapterDecOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'dec'));
//   }

//   inc(options?: AdapterIncOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'inc'));
//   }

//   set(options?: AdapterResetOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'set'));
//   }

//   startTimer(options?: AdapterStartTimerOptions): TimerMethod {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
//   }
// }

// export class Histogram implements HistogramInterface {
//   kind = 'histogram' as KIND_HISTOGRAM;

//   observe(voptions?: AdapterObserveOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'observe'));
//   }

//   reset(options?: AdapterResetOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'reset'));
//   }

//   startTimer(options?: AdapterStartTimerOptions): TimerMethod {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
//   }
// }

// export class Summary implements SummaryInterface {
//   kind = 'summary' as KIND_SUMMARY;

//   observe(voptions?: AdapterObserveOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'observe'));
//   }

//   reset(options?: AdapterResetOptions): void {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'reset'));
//   }

//   startTimer(options?: AdapterStartTimerOptions): TimerMethod {
//     throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
//   }
// }

/* eslint-enable @typescript-eslint/no-unused-vars */
