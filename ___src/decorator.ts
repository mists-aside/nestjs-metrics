/* eslint-disable @typescript-eslint/no-explicit-any */

export type GenericMethod = (...args: any[]) => any;

export type MetricWrapper = (
  metricArgs: any, // generic arguments given to the decorator
  metric: any, // metric entity
  oldMethod: GenericMethod, // decorator's descriptor.value
  target: any, // decorator argument, target
  propertyKey: string | symbol, // decorator argument, propertyKey
  descriptor: PropertyDescriptor, // decorator argument, descriptor
) => GenericMethod;

export type GeneratedDecoratorWithArgs = (...args: any) => MethodDecorator;
