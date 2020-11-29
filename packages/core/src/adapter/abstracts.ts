import {Logger} from '@nestjs/common';

import {KIND_COUNTER, KIND_GAUGE, KIND_HISTOGRAM, KIND_SUMMARY} from './interfaces';
import {
  Counter as CounterInterface,
  Gauge as GaugeInterface,
  Histogram as HistogramInterface,
  Summary as SummaryInterface,
  Tags,
  TimerMethod,
} from './interfaces';

const ERROR_MESSAGE = 'Method {method} was not implemented yet.';

export class Counter implements CounterInterface {
  public kind = 'counter' as KIND_COUNTER;

  inc(delta?: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'inc'));
  }
}

export class Gauge implements GaugeInterface {
  kind = 'gauge' as KIND_GAUGE;

  dec(delta?: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'dec'));
  }

  inc(delta?: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'inc'));
  }

  set(value: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'set'));
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
  }
}

export class Histogram implements HistogramInterface {
  kind = 'histogram' as KIND_HISTOGRAM;

  observe(value: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'observe'));
  }

  reset(label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'reset'));
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
  }
}

export class Summary implements SummaryInterface {
  kind = 'summary' as KIND_SUMMARY;

  observe(value: number, label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'observe'));
  }

  reset(label?: string, tags?: Tags): void {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'reset'));
  }

  startTimer(label?: string, tags?: Tags): TimerMethod {
    throw new Error(ERROR_MESSAGE.replace('{method}', 'startTimer'));
  }
}
