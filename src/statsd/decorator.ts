/* eslint-disable @typescript-eslint/no-explicit-any */
import {getStatsdClient} from './utils';
import * as StatsdClient from 'statsd-client';

type GenericMethod = (...args: any[]) => any;

type MethodWrapper = (
  name: string,
  target: any,
  method: GenericMethod,
  metric: StatsdClient,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor,
) => GenericMethod;

export const generateStatsdDecorator = (wrapper: MethodWrapper): ((name: string) => MethodDecorator) => {
  const metric = getStatsdClient();
  return (name: string): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(name, target, descriptor.value, metric, propertyKey, descriptor);
      return descriptor;
    };
  };
};
