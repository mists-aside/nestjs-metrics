import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import {Logger} from '@nestjs/common';
import StatsdClient from 'statsd-client';

export class MockStatsdClient extends StatsdClient {
  public logger = new Logger('MockStatsdClient');

  constructor(private readonly options: StatsdClient.CommonOptions = {}) {
    super(options);
  }

  counter(metric: string, delta: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.counter${[metric, delta, tags]}`);
    return this;
  }

  increment(metric: string, delta?: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.increment${[metric, delta, tags]}`);
    return this;
  }

  decrement(metric: string, delta?: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.decrement${[metric, delta, tags]}`);
    return this;
  }

  gauge(name: string, value: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.gauge${[name, value, tags]}`);
    return this;
  }

  gaugeDelta(name: string, delta: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.gaugeDelta${[name, delta, tags]}`);
    return this;
  }

  set(name: string, value: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.set${[name, value, tags]}`);
    return this;
  }

  timing(name: string, startOrDuration: Date | number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.timing${[name, startOrDuration, tags]}`);
    return this;
  }

  histogram(name: string, value: number, tags?: StatsdClient.Tags): this {
    this.logger.debug(mlm`MockStatsdClient.histogram${[name, value, tags]}`);
    return this;
  }

  close(): this {
    this.logger.debug(`.close()`);
    return this;
  }

  getChildClient(name: string): StatsdClient {
    return new MockStatsdClient({
      ...this.options,
      prefix: [this.options.prefix ? this.options.prefix : '', name].filter((c) => c).join('.'),
    });
  }
}
