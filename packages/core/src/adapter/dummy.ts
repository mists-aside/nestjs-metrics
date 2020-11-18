import {Logger} from '@nestjs/common';

import {
  Counter as CounterInterface,
  Gauge as GaugeInterface,
  Histogram as HistogramInterface,
  Tags,
  TimerMethod,
} from '../adapter';

const startTimer = (logger: Logger, label?: string, tags?: Tags): TimerMethod => {
  const started = new Date();
  return (newTags?: Tags) => {
    const ended = new Date();
    logger.debug(
      `Calling endTimer(${JSON.stringify(newTags)} for ${JSON.stringify(label)} after ${Math.trunc(
        (started.getTime() - ended.getTime()) / 1000,
      )}ms`,
    );
  };
};

export class Counter implements CounterInterface {
  protected logger: Logger = new Logger('DummyCounter');

  inc(delta?: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling inc(${delta}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
}

export class Gauge extends Counter implements GaugeInterface {
  protected logger: Logger = new Logger('DummyGauge');

  set(value: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling set(${value}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  dec(delta?: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling dec(${delta}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  startTimer(label?: string, tags?: Tags): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
    return startTimer(this.logger, label, tags);
  }
}

export class Histogram implements HistogramInterface {
  protected logger: Logger = new Logger('DummyHistogram');

  observe(value: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling observe(${value}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  reset(label?: string, tags?: Tags): void {
    this.logger.debug(`Calling reset(${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  startTimer(label?: string, tags?: Tags): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
    return startTimer(this.logger, label, tags);
  }
}

export class Summary extends Histogram {
  protected logger: Logger = new Logger('DummySummary');
}
