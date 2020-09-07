/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Config} from '../config';
import {GeneratedDecoratorWithArgs, GenericMethod, MetricWrapper} from '../decorator';
import {Tags} from '../options';
import {StatsdOptions} from './options';
import {getStatsdClient} from './utils';

// import {generateDecorator as genericDecorator} from '../decorator'
import StatsdClient = require('statsd-client');

export type MetricNumericArgs = [string, number, Tags?];
export type MetricDateArgs = [string, Tags?];
export type MetricArgs = MetricNumericArgs | MetricDateArgs;

// jscpd:ignore-start
export const generateDecorator = (wrapper: MetricWrapper, options?: StatsdOptions): GeneratedDecoratorWithArgs => {
  // return genericDecorator(wrapper, getStatsdClient(name, options || Config.getInstance().statsd || 'dummy'))
  return (...args: MetricArgs): MethodDecorator => {
    const [name] = args;
    const metric = getStatsdClient(name, options || Config.getInstance().statsd || 'dummy');
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
  (metric as StatsdClient).increment(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const gaugeDeltaWrapper: MetricWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsdClient).gaugeDelta(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const gaugeWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsdClient).gauge(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const histogramWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsdClient).histogram(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const timingWrapper = (
  metricArgs: MetricDateArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  const [name, tags] = metricArgs;
  const date = new Date();
  const result = oldMethod.call(target, ...args);

  if (result instanceof Promise) {
    return result
      .then((...args: any[]) => {
        (metric as StatsdClient).timing(name, date, tags);
        return args;
      })
      .catch((error) => {
        (metric as StatsdClient).timing(name, date, tags);
        throw error;
      });
  } else {
    (metric as StatsdClient).timing(name, date, tags);
    return result;
  }
};
// jscpd:ignore-end
