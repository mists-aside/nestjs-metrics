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
/**
 * Generate a Metric Decorator. Can use wrappers like {@link metricIncrementWrapper},
 * {@link metricGaugeDecrementWrapper}, {@link metricGaugeIncrementWrapper}, {@link metricGaugeSetWrapper},
 * {@link metricTimingWrapper}, {@link metricObserveWrapper}, or custom defined metric wrappers.
 *
 * ```typescript
 * const IncrementHttpCalls = generateMetricDecorator(Metrics.Counter, 'metric_http_calls', metricIncrementWrapper, genericOptions);
 *
 * export const customMetricWrapper: MetricWrapper = (
 *   metricArgs: MetricNumericArgs,
 *   metric: any,
 *   oldMethod: GenericMethod,
 *   target: any,
 *   propertyKey: string | symbol,
 *   descriptor: PropertyDescriptor,
 * ): GenericMethod => (...args: any[]): any => {
 *   (metric as Gauge).inc(...metricArgs);
 *   return oldMethod.call(target, ...args);
 * };
 *
 * const CustomIncrementHttpCalls = generateMetricDecorator(
 *   Metrics.Gauge,
 *   'metric_http_calls_custom',
 *   customMetricWrapper,
 *   genericOptions
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @IncrementHttpCalls()
 *   @CustomIncrementHttpCalls(1, { serverId: 'server_1' })
 *   testMethod() {}
 * }
 * ```
 *
 *
 * @param type Metric type
 * @param name Metric name
 * @param wrapper Metric wrapper
 * @param options Metric options
 */
export const generateMetricDecorator = (
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

/**
 * Increment Wrapper
 * Used for generating {@link Counter.inc} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricIncrementWrapper } from '@mists/nestjs-metrics';
 *
 * const Increment = generateMetricDecorator(
 *   Metrics.Counter,
 *   'metric_counter_decorator',
 *   metricIncrementWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Increment()
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Counter.inc} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricIncrementWrapper: MetricWrapper = (
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

/**
 * Gauge Decrement Wrapper
 * Used for generating {@link Gauge.dec} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricGaugeDecrementWrapper } from '@mists/nestjs-metrics';
 *
 * const GaugeDecrement = generateMetricDecorator(
 *   Metrics.Gauge,
 *   'metric_gauge_dec_decorator',
 *   metricGaugeDecrementWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeDecrement()
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Gauge.dec} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricGaugeDecrementWrapper: MetricWrapper = (
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

/**
 * Gauge Increment Wrapper
 * Used for generating {@link Gauge.inc} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricGaugeIncrementWrapper } from '@mists/nestjs-metrics';
 *
 * const GaugeDecrement = generateMetricDecorator(
 *   Metrics.Gauge,
 *   'metric_gauge_inc_decorator',
 *   metricGaugeIncrementWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeIncrement()
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Gauge.inc} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricGaugeIncrementWrapper: MetricWrapper = (
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

/**
 * Gauge Set Wrapper
 * Used for generating {@link Gauge.set} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricGaugeSetWrapper } from '@mists/nestjs-metrics';
 *
 * const GaugeSet = generateMetricDecorator(
 *   Metrics.Gauge,
 *   'metric_gauge_set_decorator',
 *   metricGaugeSetWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeSet(10)
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Gauge.set} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricGaugeSetWrapper = (
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

/**
 * Timing Wrapper
 * Used for generating {@link Gauge.setTimer}, {@link Histogram.setTimer}, {@link Summary.setTimer} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricTimingWrapper } from '@mists/nestjs-metrics';
 *
 * const ActionTiming = generateMetricDecorator(
 *   Metrics.Gauge,
 *   'metric_gauge_timing_decorator',
 *   metricTimingWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @ActionTiming({serverId: 'server_1'})
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Gauge.set} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricTimingWrapper = (
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

/**
 * Observer Wrapper
 * Used for generating  {@link Histogram.observe}, {@link Summary.observe} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generateMetricDecorator, metricObserveWrapper } from '@mists/nestjs-metrics';
 *
 * const Observer = generateMetricDecorator(
 *   Metrics.Histogram,
 *   'metric_observe_decorator',
 *   metricObserveWrapper,
 *   {}
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Observer(1, {serverId: 'server_1'})
 *   controllerAction() {}
 * }
 * ```
 *
 * @param metricArgs Argument's used by the {@link Gauge.set} method
 * @param metric Metric instance
 * @param oldMethod Old method, obtained from `descriptor.value`
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export const metricObserveWrapper = (
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
