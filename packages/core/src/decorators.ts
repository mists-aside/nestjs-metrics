import {Config} from './config';
import {CountableOptions} from './interfaces';

export enum IncMetricType {
  COUNTER,
  GAUGE,
}

/**
 * Increment decorator
 *
 * @returns {MethodDecorator}
 */
export const Inc =
  (
    options: CountableOptions,
    adapterLabels: string[] = [],
    metricType: IncMetricType = IncMetricType.COUNTER,
  ): MethodDecorator =>
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

      adapters.forEach((adapter) => {
        if (metricType === IncMetricType.COUNTER) {
          adapter.getCounter().inc(options);
        } else {
          if (metricType === IncMetricType.GAUGE) {
            // adapter.getCounter().inc(options)
          } else {
            throw new Error(`Invalid metric type: ${metricType}`);
          }
        }
      });

      return oldMethod.call(target, ...args);
    };

    return descriptor;
  };
