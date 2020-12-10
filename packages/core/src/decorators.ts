import {Counter, Gauge, Histogram, Summary} from './metric';
import {Metric} from './metric/metric';
import {Tags, TimerMethod} from './adapter/interfaces';
import {Type} from '@nestjs/common';

type IncrementMetric = Type<Counter> | Type<Gauge>;

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export const EventIncrement = (
  delta?: number,
  label?: string,
  tags?: Tags,
  adapter?: string,
  metric?: IncrementMetric,
): MethodDecorator => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const incArgs: [number?, string?, Tags?, string?] = [delta, label, tags, adapter];
  if (!adapter) {
    incArgs.pop();
  }

  const oldMethod = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = (...args: any[]): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metrics: Metric[] = metric ? [(metric as any).getInstance()] : [Counter.getInstance(), Gauge.getInstance()];

    metrics.forEach((metric) => {
      (metric as Counter).inc(...incArgs);
    });

    return oldMethod.call(target, ...args);
  };

  return descriptor;
};

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export const EventDecrement = (delta?: number, label?: string, tags?: Tags, adapter?: string): MethodDecorator => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const decArgs: [number?, string?, Tags?, string?] = [delta, label, tags, adapter];
  if (!adapter) {
    decArgs.pop();
  }

  const oldMethod = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = (...args: any[]): any => {
    Gauge.getInstance().dec(...decArgs);
    return oldMethod.call(target, ...args);
  };

  return descriptor;
};

type DurationMetric = Type<Gauge> | Type<Histogram> | Type<Summary> | (Type<Gauge> | Type<Histogram> | Type<Summary>)[];

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export const EventDuration = (
  label?: string,
  tags?: Tags,
  adapter?: string,
  metric?: DurationMetric,
): MethodDecorator => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const timerArgs: [string?, Tags?, string?] = [label, tags, adapter];
  if (!adapter) {
    timerArgs.pop();
  }

  const oldMethod = descriptor.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = (...args: any[]): any => {
    const metrics: Metric[] = metric
      ? Array.isArray(metric)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metric.map((item) => (item as any).getInstance())
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [(metric as any).getInstance()]
      : [Gauge.getInstance(), Histogram.getInstance(), Summary.getInstance()];

    const ends: TimerMethod[] = metrics
      .map((metric) => (metric as Gauge).startTimer(...timerArgs))
      .reduce((a, b) => a.concat(b), []);
    const result = oldMethod.call(target, ...args);

    if (result instanceof Promise) {
      return (
        result
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((...args: any[]) => {
            ends.forEach((end) => end(tags));
            return args;
          })
          .catch((error) => {
            ends.forEach((end) => end(tags));
            throw error;
          })
      );
    }

    ends.forEach((end) => end(tags));
    return result;
  };

  return descriptor;
};
