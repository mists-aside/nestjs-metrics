// import {MetricKind} from './interfaces';
// import {
//   CountableMetricOptions,
//   CounterMetric,
//   GaugeMetric,
//   HistogramMetric,
//   MetricOptions,
//   ObservableMetricOptions,
//   SummaryMetric,
// } from './metrics';

// // /**
// //  * Increment decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricReset =
// //   (
// //     options?: CountableMetricOptions,
// //     metric:
// //       | MetricKind<CounterMetric>
// //       | MetricKind<GaugeMetric>
// //       | MetricKind<HistogramMetric>
// //       | MetricKind<SummaryMetric> = {metricKind: 'counter'},
// //   ): MethodDecorator =>
// //     (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       target: any,
// //       propertyKey: string | symbol,
// //       descriptor: PropertyDescriptor,
// //     ): PropertyDescriptor => {
// //       const oldMethod = descriptor.value;
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       descriptor.value = (...args: any[]): any => {
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //         let metricInstance: CounterMetric | GaugeMetric | HistogramMetric | SummaryMetric;
// //         switch (metric.metricKind) {
// //         case 'gauge':
// //           metricInstance = GaugeMetric.getInstance();
// //           break;
// //         case 'histogram':
// //           metricInstance = HistogramMetric.getInstance();
// //           break;
// //         case 'summary':
// //           metricInstance = SummaryMetric.getInstance();
// //           break;
// //         default:
// //           metricInstance = CounterMetric.getInstance();
// //         }
// //         metricInstance.reset(options);

// //         return oldMethod.call(target, ...args);
// //       };

// //       return descriptor;
// //     };

// // /**
// //  * Increment decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricInc =
// //   (
// //     options?: CountableMetricOptions,
// //     metric: MetricKind<CounterMetric> | MetricKind<GaugeMetric> = {metricKind: 'counter'},
// //   ): MethodDecorator =>
// //     (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       target: any,
// //       propertyKey: string | symbol,
// //       descriptor: PropertyDescriptor,
// //     ): PropertyDescriptor => {
// //       const oldMethod = descriptor.value;
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       descriptor.value = (...args: any[]): any => {
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //         let metricInstance: CounterMetric | GaugeMetric;
// //         if (metric.metricKind === 'gauge') {
// //           metricInstance = GaugeMetric.getInstance();
// //         } else {
// //           metricInstance = CounterMetric.getInstance();
// //         }
// //         metricInstance.inc(options);

// //         return oldMethod.call(target, ...args);
// //       };

// //       return descriptor;
// //     };

// // /**
// //  * Decrement decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricDec =
// //   (options?: CountableMetricOptions): MethodDecorator =>
// //     (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       target: any,
// //       propertyKey: string | symbol,
// //       descriptor: PropertyDescriptor,
// //     ): PropertyDescriptor => {
// //       const oldMethod = descriptor.value;
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       descriptor.value = (...args: any[]): any => {
// //         GaugeMetric.getInstance().dec(options);

// //         return oldMethod.call(target, ...args);
// //       };

// //       return descriptor;
// //     };

// // /**
// //  * Set decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricSet =
// //   (options?: ObservableMetricOptions): MethodDecorator =>
// //     (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       target: any,
// //       propertyKey: string | symbol,
// //       descriptor: PropertyDescriptor,
// //     ): PropertyDescriptor => {
// //       const oldMethod = descriptor.value;
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       descriptor.value = (...args: any[]): any => {
// //         GaugeMetric.getInstance().set(options);

// //         return oldMethod.call(target, ...args);
// //       };

// //       return descriptor;
// //     };

// // /**
// //  * Observe decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricObserve =
// //   (
// //     options?: ObservableMetricOptions,
// //     metric: MetricKind<HistogramMetric> | MetricKind<SummaryMetric> = {metricKind: 'histogram'},
// //   ): MethodDecorator =>
// //     (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       target: any,
// //       propertyKey: string | symbol,
// //       descriptor: PropertyDescriptor,
// //     ): PropertyDescriptor => {
// //       const oldMethod = descriptor.value;
// //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //       descriptor.value = (...args: any[]): any => {
// //         let metricInstance: HistogramMetric | SummaryMetric;
// //         if (metric.metricKind === 'summary') {
// //           metricInstance = SummaryMetric.getInstance();
// //         } else {
// //           metricInstance = HistogramMetric.getInstance();
// //         }
// //         metricInstance.observe(options);

// //         return oldMethod.call(target, ...args);
// //       };

// //       return descriptor;
// //     };

// // /**
// //  * Timing decorator
// //  *
// //  * @returns {MethodDecorator}
// //  */
// // export const MetricTiming =
// //   (
// //     options?: MetricOptions,
// //     metric: MetricKind<GaugeMetric> | MetricKind<HistogramMetric> | MetricKind<SummaryMetric> = {metricKind: 'gauge'},
// //   ): MethodDecorator =>
// //   (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     target: any,
// //     propertyKey: string | symbol,
// //     descriptor: PropertyDescriptor,
// //   ): PropertyDescriptor => {
// //     const oldMethod = descriptor.value;
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     descriptor.value = async (...args: any[]): Promise<any> => {
// //       let metricInstance: GaugeMetric | HistogramMetric | SummaryMetric;
// //       switch (metric.metricKind) {
// //         case 'histogram':
// //           metricInstance = HistogramMetric.getInstance();
// //           break;
// //         case 'summary':
// //           metricInstance = SummaryMetric.getInstance();
// //           break;
// //         default:
// //           metricInstance = GaugeMetric.getInstance();
// //       }
// //       const endTimer = metricInstance.startTimer(options);

// //       const result = await oldMethod.call(target, ...args);

// //       endTimer();
// //       return result;
// //     };

// //     return descriptor;
// //   };
