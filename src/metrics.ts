export enum Metrics {
  Counter,
  Gauge,
  Histogram,
  Summary,
  Timer,
}



// export interface MetricOptions {
//   prometheus?: PrometheusMetricOptions;
//   statsdLabel?: string;
// }

// export class Metric {

//   protected prometheusMetric?: any
//   statsdMetric?: any

//   constructor() {
//     this.statsdMetric = statsdClientProvider.useFactory();
//   }
// }

// /**
//  * Supported by: Prometheus, Statsd
//  */
// @Injectable()
// export class Counter extends Metric {

//   constructor(
//     protected name: string,
//     protected config?: Config,
//     options?: PrometheusMetricOptions,
//   ) {
//     super();
//     this.prometheusMetric = getPrometheusMetric(Metrics.Counter, name, options)
//   }

//   inc(): void {
//     this.statsdMetric.inc(this.name.replace(/_/ig, '.'));
//     this.prometheusMetric.inc();
//   }
// }

// // // /**
// // //  * Supported by: Statsd
// // //  */
// // // export interface Sampler extends Counter {}

// // // /**
// // //  * Supported by: Statsd
// // //  */
// // // export interface Setter {
// // //   set(value: number): void;
// // // }

// // // /**
// // //  * Supported by: Prometheus, Statsd
// // //  */
// // // export interface Timer {
// // //   setToCurrentTime(): void;
// // //   startTimer(): void;
// // //   endTimer(): void;
// // // }

// // // /**
// // //  * Supported by: Prometheus, Statsd
// // //  */
// // // export interface Gauge extends Counter, Timer, Setter {
// // //   // a gauge is a counter which can decrement or set it's value directly
// // //   dec(): void;
// // //   set(value: number): void;
// // // }

// // // /**
// // //  * Supported by: Prometheus, Statsd
// // //  */
// // // export interface Histogram extends Timer {
// // //   observe(value: number): void;
// // //   reset(): void;
// // // }

// // // https://prometheus.io/docs/concepts/metric_types/

// // // https://github.com/statsd/statsd/blob/master/docs/metric_types.md
