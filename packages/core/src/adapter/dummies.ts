import {Logger} from '@nestjs/common';
import { DecOptions, IncOptions, ObserveOptions, ResetOptions, SetOptions, StartTimerOptions } from 'src/metric';

import {
  Counter as CounterAbstract,
  Gauge as GaugeAbstract,
  Histogram as HistogramAbstract,
  Summary as SummaryAbstract,
} from './abstracts';

import {Tags, TimerMethod} from './interfaces';

const startTimer = (logger: Logger, options?: StartTimerOptions): TimerMethod => {
  const started = new Date();
  logger.debug(`Calling startTimer(${JSON.stringify(options.tags)} for ${JSON.stringify(options.label)}).`);
  return (newTags?: Tags) => {
    const ended = new Date();
    logger.debug(
      `Calling endTimer(${JSON.stringify(newTags)} for ${JSON.stringify(options.label)} after ${Math.trunc(
        (started.getTime() - ended.getTime()) / 1000,
      )}ms`,
    );
  };
};

export class Counter extends CounterAbstract {
  protected logger: Logger = new Logger('DummyCounter');

  inc(options?: IncOptions): void {
    this.logger.debug(`Calling inc(${options.delta}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
}

export class Gauge extends GaugeAbstract {
  protected logger: Logger = new Logger('DummyGauge');

  dec(options?: DecOptions): void {
    this.logger.debug(`Calling dec(${options.delta}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  inc(options?: IncOptions): void {
    this.logger.debug(`Calling inc(${options.delta}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  set(options?: SetOptions): void {
    this.logger.debug(`Calling set(${options.value}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  startTimer(options?: StartTimerOptions): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
    return startTimer(this.logger, {label: options.label, tags: options.tags});
  }
}

export class Histogram extends HistogramAbstract {
  protected logger: Logger = new Logger('DummyHistogram');

  observe(options?: ObserveOptions): void {
    this.logger.debug(`Calling observe(${options.value}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  reset(options?: ResetOptions): void {
    this.logger.debug(`Calling reset(${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  startTimer(options?: StartTimerOptions): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
    return startTimer(this.logger, {label: options.label, tags: options.tags});
  }
}

export class Summary extends SummaryAbstract {
  protected logger: Logger = new Logger('DummySummary');

  observe(options?: ObserveOptions): void {
    this.logger.debug(`Calling observe(${options.value}, ${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  reset(options?: ResetOptions): void {
    this.logger.debug(`Calling reset(${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
  }
  startTimer(options?: StartTimerOptions): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(options.label)}, ${JSON.stringify(options.tags)}`);
    return startTimer(this.logger, {label: options.label, tags: options.tags});
  }
}
