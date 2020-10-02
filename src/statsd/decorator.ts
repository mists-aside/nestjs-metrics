/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Config} from '../config';
import {GeneratedDecoratorWithArgs, GenericMethod, MetricWrapper} from '../decorator';
import {Tags} from '../tags';
import {StatsDOptions} from './options';
import {getStatsdClient} from './utils';
import {StatsDClientAlike} from './options';

export type StatsDMetricNumericArgs = [string, number, Tags?];
export type StatsDMetricDateArgs = [string, Tags?];
export type StatsDMetricArgs = StatsDMetricNumericArgs | StatsDMetricDateArgs;

// jscpd:ignore-start
/**
 * Generate a Metric Decorator. Can use wrappers like {@link metricIncrementWrapper},
 * {@link metricGaugeDecrementWrapper}, {@link metricGaugeIncrementWrapper}, {@link metricGaugeSetWrapper},
 * {@link metricTimingWrapper}, {@link metricObserveWrapper}, or custom defined metric wrappers.
 *
 * ```typescript
 * import {Controller} from "@netsjs/common";
 * import {MetricWrapper, GenericMethod} from "@mists/nestjs-metrics";
 * import {StatsDMetricNumericArgs, generateStatsDDecorator} from "@mists/nestjs-metrics/dist/statsd";
 *
 * export const customMetricWrapper: MetricWrapper = (
 *   metricArgs: StatsDMetricNumericArgs,
 *   metric: any,
 *   oldMethod: GenericMethod,
 *   target: any,
 *   propertyKey: string | symbol,
 *   descriptor: PropertyDescriptor,
 * ): GenericMethod => (...args: any[]): any => {
 *   (metric as StatsDClientAlike).increment(...metricArgs);
 *   return oldMethod.call(target, ...args);
 * };
 *
 *
 * const IncrementHttpCalls = generateStatsDDecorator(metricIncrementWrapper);
 *
 * const CustomIncrementHttpCalls = generateStatsDDecorator(customMetricWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @IncrementHttpCalls()
 *   @CustomIncrementHttpCalls(1, { serverId: 'server_1' })
 *   testMethod() {}
 * }
 * ```
 */
export const generateStatsDDecorator = (
  wrapper: MetricWrapper,
  options?: StatsDOptions,
): GeneratedDecoratorWithArgs => {
  return (...args: StatsDMetricArgs): MethodDecorator => {
    const [name] = args;
    const metric = getStatsdClient(name, options || Config.getInstance().statsd || 'dummy');
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(args, metric, descriptor.value, target, propertyKey, descriptor);
      return descriptor;
    };
  };
};

/**
 * Increment Wrapper
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateStatsDDecorator, statsdIncrementWrapper } from "@mists/nestjs-metrics/dist/statsd";
 *
 * const Increment = generateStatsDDecorator(statsdIncrementWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Increment()
 *   controllerAction() {}
 * }
 * ```
 */
export const statsdIncrementWrapper: MetricWrapper = (
  metricArgs: StatsDMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsDClientAlike).increment(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * StatsD GaugeDelta Wrapper
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateStatsDDecorator, statsdGaugeDeltaWrapper } from "@mists/nestjs-metrics/dist/statsd";
 *
 * const GaugeDelta = generateStatsDDecorator(statsdGaugeDeltaWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeDelta(-1)
 *   controllerAction() {}
 * }
 * ```
 */
export const statsdGaugeDeltaWrapper: MetricWrapper = (
  metricArgs: StatsDMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsDClientAlike).gaugeDelta(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * StatsD Gauge Wrapper
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateStatsDDecorator, statsdGaugeWrapper } from "@mists/nestjs-metrics/dist/statsd";
 *
 * const GaugeSet = generateStatsDDecorator(statsdGaugeWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeSet(1)
 *   controllerAction() {}
 * }
 * ```
 */
export const statsdGaugeWrapper = (
  metricArgs: StatsDMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsDClientAlike).gauge(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * StatsD Histogram Wrapper
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateStatsDDecorator, statsdHistogramWrapper } from "@mists/nestjs-metrics/dist/statsd";
 *
 * const Histogram = generateStatsDDecorator(statsdHistogramWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Histogram(1)
 *   controllerAction() {}
 * }
 * ```
 */
export const statsdHistogramWrapper = (
  metricArgs: StatsDMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as StatsDClientAlike).histogram(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * StatsD Timing Wrapper
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateStatsDDecorator, statsdTimingWrapper } from "@mists/nestjs-metrics/dist/statsd";
 *
 * const Timing = generateStatsDDecorator(statsdTimingWrapper);
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Timing()
 *   controllerAction() {}
 * }
 * ```
 */
export const statsdTimingWrapper = (
  metricArgs: StatsDMetricDateArgs,
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
        (metric as StatsDClientAlike).timing(name, date, tags);
        return args;
      })
      .catch((error) => {
        (metric as StatsDClientAlike).timing(name, date, tags);
        throw error;
      });
  } else {
    (metric as StatsDClientAlike).timing(name, date, tags);
    return result;
  }
};
// jscpd:ignore-end
