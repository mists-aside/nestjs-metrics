// import {Counter, DecOptions, Gauge, Histogram, IncOptions, StartTimerOptions, Summary} from './metrics';
// import {Metric} from './metrics/metric';
// import {TimerMethod} from './interfaces';
// import {Type} from '@nestjs/common';

// type IncrementMetric = Type<Counter> | Type<Gauge>;

// /**
//  * Comment
//  *
//  * @returns {MethodDecorator}
//  */
// export const EventIncrement = (
//   options?: IncOptions,
//   metric?: IncrementMetric,
// ): MethodDecorator => (
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   target: any,
//   propertyKey: string | symbol,
//   descriptor: PropertyDescriptor,
// ): PropertyDescriptor => {const oldMethod = descriptor.value;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   descriptor.value = (...args: any[]): any => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const metrics: Metric[] = metric ? [(metric as any).getInstance()] : [Counter.getInstance(), Gauge.getInstance()];

//     metrics.forEach((metric) => {
//       (metric as Counter).inc(options);
//     });

//     return oldMethod.call(target, ...args);
//   };

//   return descriptor;
// };

// /**
//  * Comment
//  *
//  * @returns {MethodDecorator}
//  */
// export const EventDecrement = (options?: DecOptions): MethodDecorator => (
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   target: any,
//   propertyKey: string | symbol,
//   descriptor: PropertyDescriptor,
// ): PropertyDescriptor => {
//   const oldMethod = descriptor.value;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   descriptor.value = (...args: any[]): any => {
//     Gauge.getInstance().dec(options);
//     return oldMethod.call(target, ...args);
//   };

//   return descriptor;
// };

// type DurationMetric = Type<Gauge> | Type<Histogram> | Type<Summary> | (Type<Gauge> | Type<Histogram> | Type<Summary>)[];

// /**
//  * Comment
//  *
//  * @returns {MethodDecorator}
//  */
// export const EventDuration = (
//   options?: StartTimerOptions,
//   metric?: DurationMetric,
// ): MethodDecorator => (
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   target: any,
//   propertyKey: string | symbol,
//   descriptor: PropertyDescriptor,
// ): PropertyDescriptor => {const oldMethod = descriptor.value;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   descriptor.value = (...args: any[]): any => {
//     const metrics: Metric[] = metric
//       ? Array.isArray(metric)
//         ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           metric.map((item) => (item as any).getInstance())
//         : // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           [(metric as any).getInstance()]
//       : [Gauge.getInstance(), Histogram.getInstance(), Summary.getInstance()];

//     const {tags} = options;

//     const ends: TimerMethod[] = metrics
//       .map((metric) => (metric as Gauge).startTimer(options))
//       .reduce((a, b) => a.concat(b), []);
//     const result = oldMethod.call(target, ...args);

//     if (result instanceof Promise) {
//       return (
//         result
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           .then((...args: any[]) => {
//             ends.forEach((end) => end(tags));
//             return args;
//           })
//           .catch((error) => {
//             ends.forEach((end) => end(tags));
//             throw error;
//           })
//       );
//     }

//     ends.forEach((end) => end(tags));
//     return result;
//   };

//   return descriptor;
// };
