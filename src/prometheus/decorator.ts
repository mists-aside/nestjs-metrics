/* eslint-disable @typescript-eslint/no-unused-vars */
import * as PromClient from 'prom-client';

import {GeneratedDecoratorWithArgs, GenericMethod, MetricWrapper} from '../decorator';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metrics} from '../enum';
import {Tags} from '../tags';
import {PrometheusMetricOptions} from './options';
import {getPrometheusMetric} from './utils';

export type PrometheusMetricNumericArgs = [Tags, number];
export type PrometheusMetricDateArgs = [Tags?];
export type PrometheusMetricArgs = PrometheusMetricNumericArgs | PrometheusMetricDateArgs;

// jscpd:ignore-start
/**
 * Generate a Metric Decorator. Can use wrappers like {@link prometheusIncrementWrapper},
 * {@link prometheusGaugeDecrementWrapper}, {@link prometheusGaugeIncrementWrapper}, {@link prometheusGaugeSetWrapper},
 * {@link prometheusTimingWrapper}, {@link prometheusObserveWrapper}, or custom defined metric wrappers.
 *
 * ```typescript
 * const IncrementHttpCalls = generatePrometheusDecorator(Metrics.Counter, 'metric_http_calls');
 *
 * export const customMetricWrapper: MetricWrapper = (
 *   metricArgs: MetricNumericArgs,
 *   metric: any,
 *   oldMethod: GenericMethod,
 *   target: any,
 *   propertyKey: string | symbol,
 *   descriptor: PropertyDescriptor,
 * ): GenericMethod => (...args: any[]): any => {
 *   (metric as PromClient.Counter<string>).inc(...metricArgs);
 *   return oldMethod.call(target, ...args);
 * };
 *
 * const CustomIncrementHttpCalls = generatePrometheusDecorator(
 *   Metrics.Gauge,
 *   'metric_http_calls_custom'
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
 */
export const generatePrometheusDecorator = (
  type: Metrics,
  wrapper: MetricWrapper,
  options?: PrometheusMetricOptions,
): GeneratedDecoratorWithArgs => {
  return (...args: PrometheusMetricArgs): MethodDecorator => {
    const metric = getPrometheusMetric(type, options);
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      descriptor.value = wrapper(args, metric, descriptor.value, target, propertyKey, descriptor);
      return descriptor;
    };
  };
};

/**
 * Prometheus Increment Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#counter | PromClient.Counter.inc} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusIncrementWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const Increment = generatePrometheusDecorator(
 *   Metrics.Counter,
 *   prometheusIncrementWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Increment()
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusIncrementWrapper: MetricWrapper = (
  metricArgs: PrometheusMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as PromClient.Counter<string>).inc(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * Prometheus Gauge Increment Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#gauge | PromClient.Gauge.inc} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusGaugeIncrementWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const GaugeInc = generatePrometheusDecorator(
 *   Metrics.Gauge,
 *   prometheusGaugeIncrementWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeInc()
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusGaugeIncrementWrapper: MetricWrapper = (
  metricArgs: PrometheusMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as PromClient.Gauge<string>).inc(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * Prometheus Gauge Decrement Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#gauge | PromClient.Gauge.dec} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusGaugeDecrementWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const GaugeDec = generatePrometheusDecorator(
 *   Metrics.Gauge,
 *   prometheusGaugeDecrementWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeDec()
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusGaugeDecrementWrapper: MetricWrapper = (
  metricArgs: PrometheusMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as PromClient.Gauge<string>).dec(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * Prometheus Gauge Set Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#gauge | PromClient.Gauge.set} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusGaugeSetWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const GaugeSet = generatePrometheusDecorator(
 *   Metrics.Gauge,
 *   prometheusGaugeSetWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @GaugeSet(1)
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusGaugeSetWrapper = (
  metricArgs: PrometheusMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => (...args: any[]): any => {
  (metric as PromClient.Gauge<string>).set(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * Prometheus Histogram/Summary Observe Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#histogram | PromClient.Histogram.observe} or
 * {@link https://github.com/siimon/prom-client#summary | PromClient.Summary.observe} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusObserveWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const Observe = generatePrometheusDecorator(
 *   Metrics.Histogram,
 *   prometheusObserveWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Observe(1)
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusObserveWrapper = (
  metricArgs: PrometheusMetricNumericArgs,
  metric: any,
  oldMethod: GenericMethod,
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): GenericMethod => <T extends PromClient.Histogram<string> | PromClient.Summary<string>>(...args: any[]): any => {
  (metric as T).observe(...metricArgs);
  return oldMethod.call(target, ...args);
};

/**
 * Prometheus Histogram/Summary Observe Wrapper
 * Used for generating {@link https://github.com/siimon/prom-client#gauge | PromClient.Gauge.startTimer} or
 * {@link https://github.com/siimon/prom-client#histogram | PromClient.Histogram.startTimer} or
 * {@link https://github.com/siimon/prom-client#summary | PromClient.Summary.startTimer} trigger
 *
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { generatePrometheusDecorator, prometheusTimingWrapper } from '@mists/nestjs-metrics/dist/prometheus';
 *
 * const Timing = generatePrometheusDecorator(
 *   Metrics.Histogram,
 *   prometheusTimingWrapper
 * );
 *
 * @Controller('/test')
 * class CustomController {
 *   @Get()
 *   @Timing()
 *   controllerAction() {}
 * }
 * ```
 */
export const prometheusTimingWrapper = (
  metricArgs: PrometheusMetricDateArgs,
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
