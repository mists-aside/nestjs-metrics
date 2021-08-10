export type Tags = Record<string, string | number>;

/***************************************************************************
 * Metric Adapter
 * A wrapper over any metric framework that we'll use
 */

export interface AdapterFilter {
  (adapter: Adapter): boolean;
}

export interface Adapter {
  adapterLabel: string;

  getCounter(): Counter;
}

/***************************************************************************
 * Metric Callable Options
 */
export interface MetricOptions {
  // the labels in label options refer to the metrics labels
  labels: string[];
  /**
   * Additional, particular options for each custom metrics
   * @TODO: TBD...
   */
  options?: Record<string, unknown>;
}

export interface ObservableOptions extends MetricOptions {
  delta: number;
  tags?: Tags;
}

export interface CountableOptions extends Omit<ObservableOptions, 'delta'> {
  delta?: number;
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
  reset(options: MetricOptions): void;
}
