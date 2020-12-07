import {Counter, Gauge, Histogram, Summary} from './metric';
import {Metric} from './metric/metric';
import {Tags} from './adapter/interfaces';
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
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const incArgs: [number?, string?, Tags?, string?] = [delta, label, tags, adapter];
  if (!adapter) {
    incArgs.pop();
  }

  const oldMethod = descriptor.value;
  descriptor.value = (...args: any[]): any => {
    const metrics: Metric[] = metric? [(metric as any).getInstance()] : [Counter.getInstance(), Gauge.getInstance()];

    console.log(metrics)
    metrics.forEach((metric) => {
      (metric as Counter).inc(...incArgs)
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
export const EventDecrement = (delta?: number, label?: string, tags?: Tags, adapter?: string): MethodDecorator =>
  (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const decArgs: [number?, string?, Tags?, string?] = [delta, label, tags, adapter];
    if (!adapter) {
      decArgs.pop();
    }

    const oldMethod = descriptor.value;
    descriptor.value = (...args: any[]): any => {
      Gauge.getInstance().dec(...decArgs);
      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };

type DurationMetric = Type<Gauge> | Type<Histogram> | Type<Summary> | [Type<Gauge>?, Type<Histogram>?, Type<Summary>?];

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export const EventDuration = (
  value: number,
  label?: string,
  tags?: Tags,
  adapter?: string,
  metric?: DurationMetric
): MethodDecorator =>
  (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return null;
  };
