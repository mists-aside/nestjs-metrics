import {GeneratedDecoratorWithArgs, GenericMethod, MetricWrapper} from '../decorator';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metrics} from '../enum';
import {Tags} from '../options';
import {Counter} from './counter';
import {Gauge} from './gauge';
import {Histogram} from './histogram';
import {MetricOptions} from './options';
import {Summary} from './summary';
import {getMetric} from './utils';

export type MetricNumericArgs = [number, Tags];
export type MetricDateArgs = [Tags?];
export type MetricArgs = MetricNumericArgs | MetricDateArgs;

// jscpd:ignore-start

export const generateDecorator = (
  type: Metrics,
  name: string,
  wrapper: MetricWrapper,
  options?: MetricOptions,
): GeneratedDecoratorWithArgs => {
  return (...args: MetricArgs): MethodDecorator => {
    const metric = getMetric(type, name, options);
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(args, metric, descriptor.value, target, propertyKey, descriptor);
      return descriptor;
    };
  };
};

export const incrementWrapper: MetricWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as Counter).inc(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const gaugeIncrementWrapper: MetricWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as Gauge).inc(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const gaugeDecrementWrapper: MetricWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as Gauge).dec(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const gaugeSetWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as Gauge).set(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const timingWrapper = (
  metricArgs: MetricDateArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => <T extends Gauge | Histogram | Summary>(...args: any[]): any => {
  const end = (metric as T).startTimer(...metricArgs);
  const result = oldMethod.call(target, ...args);

  if (result instanceof Promise) {
    return result
      .then((...args: any[]) => {
        end();
        return args;
      })
      .catch((error) => {
        end();
        throw error;
      });
  } else {
    end();
    return result;
  }
};

export const observeWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => <T extends Histogram | Summary>(...args: any[]): any => {
  (metric as T).observe(...metricArgs);
  return oldMethod.call(target, ...args);
};

// jscpd:ignore-end
