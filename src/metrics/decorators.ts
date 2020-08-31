/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metrics} from '../enum';
import {Metric} from './metric';
import {MetricOptions} from './options';
import {getMetric} from './utils';

type GenericMethod = (...args: any[]) => any;

type MethodWrapper = (
  target: any,
  method: GenericMethod,
  metric: Metric,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor,
) => GenericMethod;

export const generateDecorator = (
  type: Metrics,
  name: string,
  wrapper: MethodWrapper,
  options?: MetricOptions,
): (() => MethodDecorator) => {
  const metric = getMetric(type, name, options);
  return (): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(target, descriptor.value, metric, propertyKey, descriptor);
      return descriptor;
    };
  };
};
