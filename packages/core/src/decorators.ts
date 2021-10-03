import {Logger} from '@nestjs/common';

import {Config} from './config';
import {CountableOptions, ObservableOptions, TaggableOptions} from './interfaces';

/* eslint-disable indent,max-lines-per-function */

export enum IncMetricType {
  COUNTER,
  GAUGE,
}

export interface MetricDecoratorOptions {
  adapterLabels?: string[];
  logger?: Logger;
}

/**
 * Decrement decorator
 *
 * @returns {MethodDecorator}
 */
export const Dec =
  ({
    adapterLabels = [],
    logger,
    options,
  }: MetricDecoratorOptions & {
    options: CountableOptions;
  }): MethodDecorator =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const oldMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = (...args: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapters = Config.getInstance().adapters.filter(
        (adapter) => adapterLabels.length === 0 || adapterLabels.includes(adapter.adapterLabel),
      );
      adapters.forEach((adapter) => adapter.getGauge().dec(options));

      logger && logger.verbose(`Called @Dec(${propertyKey.toString()})(${JSON.stringify({adapterLabels, options})})`);

      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };

/**
 * Increment decorator
 *
 * @returns {MethodDecorator}
 */
export const Inc =
  ({
    adapterLabels = [],
    logger,
    metricType = IncMetricType.COUNTER,
    options,
  }: MetricDecoratorOptions & {
    metricType?: IncMetricType;
    options: CountableOptions;
  }): MethodDecorator =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const oldMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = (...args: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapters = Config.getInstance().adapters.filter(
        (adapter) => adapterLabels.length === 0 || adapterLabels.includes(adapter.adapterLabel),
      );

      adapters.forEach((adapter) =>
        (metricType === IncMetricType.COUNTER ? adapter.getCounter() : adapter.getGauge()).inc(options),
      );

      logger &&
        logger.verbose(
          `Called @Inc(${propertyKey.toString()})(${JSON.stringify({adapterLabels, options, metricType})})`,
        );

      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };

export enum ObserveMetricType {
  Histogram,
  Summary,
}

/**
 * Set decorator
 *
 * @returns {MethodDecorator}
 */
export const Observe =
  ({
    adapterLabels = [],
    logger,
    metricType = ObserveMetricType.Histogram,
    options,
  }: MetricDecoratorOptions & {
    metricType?: ObserveMetricType;
    options: ObservableOptions;
  }): MethodDecorator =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const oldMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = (...args: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapters = Config.getInstance().adapters.filter(
        (adapter) => adapterLabels.length === 0 || adapterLabels.includes(adapter.adapterLabel),
      );

      adapters.forEach((adapter) =>
        (metricType === ObserveMetricType.Histogram ? adapter.getHistogram() : adapter.getSummary()).observe(options),
      );

      logger &&
        logger.verbose(
          `Called @Observe(${propertyKey.toString()})(${JSON.stringify({adapterLabels, metricType, options})})`,
        );

      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };

/**
 * Set decorator
 *
 * @returns {MethodDecorator}
 */
export const Set =
  ({
    adapterLabels = [],
    logger,
    options,
  }: MetricDecoratorOptions & {
    options: ObservableOptions;
  }): MethodDecorator =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const oldMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = (...args: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapters = Config.getInstance().adapters.filter(
        (adapter) => adapterLabels.length === 0 || adapterLabels.includes(adapter.adapterLabel),
      );

      adapters.forEach((adapter) => adapter.getGauge().set(options));

      logger && logger.verbose(`Called @Set(${propertyKey.toString()})(${JSON.stringify({adapterLabels, options})})`);

      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };

export enum TimerMetricType {
  Gauge,
  Histogram,
  Summary,
}

/**
 * Timer decorator
 *
 * @returns {MethodDecorator}
 */
export const Timer =
  ({
    adapterLabels = [],
    logger,
    metricType = TimerMetricType.Gauge,
    options,
  }: MetricDecoratorOptions & {
    metricType?: TimerMetricType;
    options: TaggableOptions;
  }): MethodDecorator =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const oldMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = (...args: any[]): any => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapters = Config.getInstance().adapters.filter(
        (adapter) => adapterLabels.length === 0 || adapterLabels.includes(adapter.adapterLabel),
      );

      const timers = adapters.map((adapter) =>
        (metricType === TimerMetricType.Gauge
          ? adapter.getGauge()
          : metricType === TimerMetricType.Histogram
          ? adapter.getHistogram()
          : adapter.getSummary()
        ).startTimer(options),
      );

      logger &&
        logger.verbose(
          `Called @Timer(${propertyKey.toString()})(${JSON.stringify({adapterLabels, metricType, options})})`,
        );

      const result = oldMethod.call(target, ...args);

      if (result instanceof Promise) {
        result.then((data) => {
          logger &&
            logger.verbose(
              `Called endTimer(${propertyKey.toString()})(${JSON.stringify({adapterLabels, metricType, options})})`,
            );
          timers.forEach((timer) => timer(options));
          return data;
        });
      } else {
        logger &&
          logger.verbose(
            `Called endTimer(${propertyKey.toString()})(${JSON.stringify({adapterLabels, metricType, options})})`,
          );
        timers.forEach((timer) => timer(options));
      }

      return result;
    };

    return descriptor;
  };
