import {CounterOptions} from './options';
import {Metrics} from '../enum';
import {Metric} from './generic';
import {Tags} from '../options';

/**
 * Counter Metric
 * * For Prometheus, counters go up, and reset when the process restarts.
 * * For Statsd, counters go up, and reset when stasd daemon is restarted.
 *
 * ```javascript
 * const counter = new Counter('metric_counter');
 *
 * // force prometheus settings
 * const counter = new Counter('metric_counter', {
 *   prometheus: {
 *     help: 'This is a counter metric'
 *   }
 * })
 *
 * // force statsd settings; if no settings are provided here,
 * // default settings will be used
 * const counter = new Counter('metric_counter', {
 *   statsd: {
 *     host: 'localhost',
 *     socketTimeout: 2000,
 *   }
 * })
 * ```
 */
export class Counter extends Metric {
  constructor(name: string, options?: CounterOptions) {
    super(name, Metrics.Counter, options);
  }

  /**
   * Increment method.
   *
   * ```javascript
   * const counter = new Counter('metric_counter');
   *
   * // will increment by 1 (the default value)
   * counter.inc();
   *
   * // will increment by 10 (custom value)
   * counter.inc(10);
   *
   * // will increment by 1, attaching also a `server_id` label
   * counter.inc(1, {server_id: 'instance_1'})
   * ```
   *
   * @param value Value to increment with; default 1
   * @param tags Tags to attach to the increment; optional
   */
  inc(value = 1, tags?: Tags): void {
    this.prometheusMetric.inc(tags || {}, value);
    this.statsdClient.increment(this.statsdName, value, tags || {});
  }
}
