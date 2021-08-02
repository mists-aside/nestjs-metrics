import {exception} from 'console';

import {Config} from './config';
import {CountableOptions} from './interfaces';

/**
 * Increment decorator
 *
 * @returns {MethodDecorator}
 */
export const Inc =
  (
    options: CountableOptions,
    adapterLabels: string[] = [],
    metricType: 'counter' | 'gauge' = 'counter',
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
          if (metricType === 'counter') {
            adapter.getCounter().inc(options);
          } else {
            if (metricType === 'gauge') {
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
