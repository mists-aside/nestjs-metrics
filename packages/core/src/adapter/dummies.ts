import {Logger} from '@nestjs/common';

import {
  Counter as CounterAbstract,
  Gauge as GaugeAbstract,
  Histogram as HistogramAbstract,
  Summary as SummaryAbstract,
} from './abstracts';

import {Tags, TimerMethod} from './interfaces';

const startTimer = (logger: Logger, label?: string, tags?: Tags): TimerMethod => {
  const started = new Date();
  logger.debug(`Calling startTimer(${JSON.stringify(tags)} for ${JSON.stringify(label)}).`);
  return (newTags?: Tags) => {
    const ended = new Date();
    logger.debug(
      `Calling endTimer(${JSON.stringify(newTags)} for ${JSON.stringify(label)} after ${Math.trunc(
        (started.getTime() - ended.getTime()) / 1000,
      )}ms`,
    );
  };
};

export class Counter extends CounterAbstract {
  protected logger: Logger = new Logger('DummyCounter');

  inc(delta?: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling inc(${delta}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
}

export class Gauge extends GaugeAbstract {
  protected logger: Logger = new Logger('DummyGauge');

  dec(delta?: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling dec(${delta}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  inc(delta?: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling inc(${delta}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  set(value: number, label?: string, tags?: Tags): void {
    this.logger.debug(`Calling set(${value}, ${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
  }
  startTimer(label?: string, tags?: Tags): TimerMethod {
    this.logger.debug(`Calling startTimer(${JSON.stringify(label)}, ${JSON.stringify(tags)}`);
    return startTimer(this.logger, label, tags);
  }
}

export class Histogram extends HistogramAbstract {
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

export class Summary extends SummaryAbstract {
  protected logger: Logger = new Logger('DummySummary');

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
