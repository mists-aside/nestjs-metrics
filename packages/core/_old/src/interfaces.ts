/***************************************************************************
 * Metric Options
 */

export interface Tags {
  [key: string]: string | number;
}

export interface LabelOptions {
  label: string | string[];
}

export interface ObservableOptions extends LabelOptions {
  delta: number;
  tags?: Tags;
}

export interface CountableOptions extends Omit<ObservableOptions, 'delta'> {
  delta?: number;
}

export interface TimerOptions {
  tags?: Tags;
}

export interface EndTimerMethod {
  (options?: TimerOptions): void;
}

/***************************************************************************
 * Counter
 */

/**
 * Counter
 *
 * As Prometheus and StatsD describe:
 * A counter is a cumulative metric that represents a single monotonically increasing counter whose value can only
 * increase or be reset to zero on restart. For example, you can use a counter to represent the number of requests
 * served, tasks completed, or errors.
 *
 * Also, according Prometheus recommendation:
 * A counter will not expose a value that can decrease. For example, do not use a counter for the number of
 * currently running processes; instead use a gauge.
 *
 * @link https://github.com/siimon/prom-client#counter
 * @link https://prometheus.io/docs/concepts/metric_types/#counter
 * @link https://github.com/msiebuhr/node-statsd-client#counting-stuff
 * @link https://github.com/statsd/statsd/blob/master/docs/metric_types.md#counting
 */
export interface Counter {
  /**
   * Increment
   * @param options
   */
  inc(options: CountableOptions): void;

  /**
   * Reset counter values
   */
  reset(options: LabelOptions): void;
}

// /***************************************************************************
//  * Gauge
//  */

// /**
//  * A gauge is a metric that represents a single numerical value that can arbitrarily go up and down.
//  *
//  * Gauges are typically used for measured values like temperatures or current memory usage, but also "counts" that
//  * can go up and down, like the number of concurrent requests.
//  *
//  * According to StatsD, a gauge will take on the arbitrary value assigned to it, and will maintain its value until
//  * it is next set.
//  *
//  * @link https://github.com/siimon/prom-client#gauge
//  * @link https://prometheus.io/docs/concepts/metric_types/#gauge
//  * @link https://github.com/msiebuhr/node-statsd-client#gauges
//  * @link https://github.com/statsd/statsd/blob/master/docs/metric_types.md#gauges
//  *
//  * @param options
//  */
// export interface Gauge extends Metric {
//   metricKind: 'gauge';

//   /**
//    * Increment gauge
//    * @param options
//    */
//   inc(options?: CountableOptions): void;

//   /**
//    * Decrement gauge
//    * @param options
//    */
//   dec(options?: CountableOptions): void;

//   /**
//    * Set gauge value
//    * @param options
//    */
//   set(options: ObservableOptions): void;

//   /**
//    * Start a timer where the gauges value will be the duration in seconds
//    * @param options
//    */
//   startTimer(options?: TimerOptions): EndTimerMethod;
// }

// /***************************************************************************
//  * Histogram
//  */

// /**
//  * Histogram
//  *
//  * A histogram samples observations (usually things like request durations or response sizes) and counts them in
//  * configurable buckets. It also provides a sum of all observed values.
//  *
//  * Please note that Histogram/Summary notions tend to differ between Prometheus and StatsD, so please read
//  * the documentation for configuring both servers towards to the desired results.
//  *
//  * @link https://github.com/siimon/prom-client#histogram
//  * @link https://github.com/siimon/prom-client#histogram
//  * @link https://github.com/msiebuhr/node-statsd-client#histogram
//  * @link https://github.com/statsd/statsd/blob/master/docs/metric_types.md#timing
//  *
//  * @param options
//  */
// export interface Histogram extends Metric {
//   metricKind: 'histogram';

//   /**
//    * Observe value for given labels
//    */
//   observe(options: ObservableOptions): void;

//   /**
//    * Start a timer where the value in seconds will observed
//    */
//   startTimer(options?: TimerOptions): EndTimerMethod;

//   /**
//    * Reset histogram values
//    */
//   reset(): void;
// }

// /***************************************************************************
//  * Summary
//  */

// /**
//  * Summary
//  *
//  * Similar to a histogram, a summary samples observations (usually things like request durations and response sizes).
//  * While it also provides a total count of observations and a sum of all observed values, it calculates configurable
//  * quantiles over a sliding time window.
//  *
//  * When we're talking of Histogram and Summary, from StasD's point of view, our implementation is pretty much the same
//  * thing and it matters a lot how you configure the metric server side.
//  *
//  * @link https://github.com/siimon/prom-client#summary
//  * @link https://prometheus.io/docs/concepts/metric_types/#summary
//  * @link https://github.com/msiebuhr/node-statsd-client#histogram
//  * @link https://github.com/statsd/statsd/blob/master/docs/metric_types.md#timing
//  *
//  * @param options
//  */
// export interface Summary extends Omit<Metric, 'metricKind'> {
//   metricKind: 'summary';
// }
