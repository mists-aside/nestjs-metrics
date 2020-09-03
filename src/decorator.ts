/* eslint-disable @typescript-eslint/no-explicit-any */
import {Tags} from './options';

export type GenericMethod = (...args: any[]) => any;

export type MetricNumericArgs = [string, number, Tags?];
export type MetricDateArgs = [string, Tags?];
export type MetricArgs = MetricNumericArgs | MetricDateArgs;

export type MetricWrapper = (
  metricArgs: MetricArgs, // generic arguments given to the decorator
  metric: any, // metric entity
  oldMethod: GenericMethod, // decorator's descriptor.value
  target: any, // decorator argument, target
  propertyKey: string | symbol, // decorator argument, propertyKey
  descriptor: PropertyDescriptor, // decorator argument, descriptor
) => GenericMethod;

export type GeneratedDecoratorWithArgs = (...args: MetricArgs) => MethodDecorator;

// /**
//  *
//  * @param wrapper
//  * @param metric
//  */
// export const generateDecorator = (wrapper: MetricWrapper, metric: any): GeneratedDecoratorWithArgs => {
//   return (...args: MetricArgs): MethodDecorator => {
//     return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
//       descriptor.value = wrapper(args, metric, target, propertyKey, descriptor);
//       return descriptor;
//     };
//   };
// };
