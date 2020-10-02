/* eslint-disable @typescript-eslint/no-unused-vars */
import * as PromClient from 'prom-client';

import {GeneratedDecoratorWithArgs, GenericMethod, MetricWrapper} from '../decorator';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metrics} from '../enum';
import {Tags} from '../tags';
import {PrometheusMetricOptions} from './options';
import {getPrometheusMetric} from './utils';

export type MetricNumericArgs = [Tags, number];
export type MetricDateArgs = [Tags?];
export type MetricArgs = MetricNumericArgs | MetricDateArgs;

// jscpd:ignore-start
export const generateDecorator = (
  type: Metrics,
  wrapper: MetricWrapper,
  options?: PrometheusMetricOptions,
): GeneratedDecoratorWithArgs => {
  return (...args: MetricArgs): MethodDecorator => {
    const metric = getPrometheusMetric(type, options);
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
  (metric as PromClient.Counter<string>).inc(...metricArgs);
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
  (metric as PromClient.Gauge<string>).inc(...metricArgs);
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
  (metric as PromClient.Gauge<string>).dec(...metricArgs);
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
  (metric as PromClient.Gauge<string>).set(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const observeWrapper = (
  metricArgs: MetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => <T extends PromClient.Histogram<string> | PromClient.Summary<string>>(...args: any[]): any => {
  (metric as T).observe(...metricArgs);
  return oldMethod.call(target, ...args);
};

export const timingWrapper = (
  metricArgs: MetricDateArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => <T extends PromClient.Gauge<string> | PromClient.Histogram<string> | PromClient.Summary<string>>(
  ...args: any[]
): any => {
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
// jscpd:ignore-end
