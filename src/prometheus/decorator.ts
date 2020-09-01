/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metrics} from '../enum';
import {getPrometheusMetric, PrometheusMetricOptions} from './utils';
import {Metric} from 'prom-client';

type GenericMethod = (...args: any[]) => any;

type MethodWrapper = (
  target: any,
  method: GenericMethod,
  metric: Metric<string>,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor,
) => GenericMethod;

export const generatePrometheusDecorator = (
  type: Metrics,
  wrapper: MethodWrapper,
  options?: PrometheusMetricOptions,
): (() => MethodDecorator) => {
  const metric = getPrometheusMetric(type, options);
  // jscpd:ignore-start
  return (): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(target, descriptor.value, metric, propertyKey, descriptor);
      return descriptor;
    };
  };
  // jscpd:ignore-end
};
