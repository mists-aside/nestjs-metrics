import {Metrics} from '../enum';
import {Metric, Timer, TimerEnd} from './generic';
import {GaugeOptions} from './options';
import {Tags} from '../options';

/**
 * Gauge Metric
 *
 * Gauges are similar to Gauges. Only difference is that they can be decreased or reset at demand.
 * One more feature for gauges, is the timer metric which can record duration of events.
 *
 * ```typescript
 * const gauge = new Gauge('metric_gauge');
 *
 * // force prometheus settings
 * const gauge = new Gauge('metric_gauge', {
 *   prometheus: {
 *     help: 'This is a gauge metric'
 *   }
 * })
 *
 * // force statsd settings; if no settings are provided here,
 * // default settings will be used
 * const gauge = new Gauge('metric_gauge', {
 *   statsd: {
 *     host: 'localhost',
 *     socketTimeout: 2000,
 *   }
 * })
 * ```
 */
export class Gauge extends Metric {
  /**
   *
   * @param name Name used for the metric
   * @param options Options for the metric <br /> Depending on the metric technology used. Even though the MetricOptions
   *                support almost all options for each supported technology, be careful how you use and setup your
   *                options since they may generated strange behaviors that were not intended with this API.
   */
  constructor(name: string, options?: GaugeOptions) {
    super(name, Metrics.Gauge, options);
  }

  /**
   * Decrement method.
   *
   * ```typescript
   * const gauge = new Gauge('metric_gauge');
   *
   * // will decrement by 1 (the default value)
   * gauge.dec();
   *
   * // will decrement by 10 (custom value)
   * gauge.dec(10);
   *
   * // will decrement by 1, attaching also a `server_id` label
   * gauge.dec(1, {server_id: 'instance_1'})
   * ```
   *
   * @param value Value to decrement with; default 1
   * @param tags Tags to attach to the increment; optional
   */
  dec(value = 1, tags?: Tags): void {
    console.log('Gauge.dec', value, tags);
    this.prometheusMetric.dec(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, -value, tags || {});
  }

  /**
   * Increment method.
   *
   * ```typescript
   * const gauge = new Gauge('metric_gauge');
   *
   * // will increment by 1 (the default value)
   * gauge.inc();
   *
   * // will increment by 10 (custom value)
   * gauge.inc(10);
   *
   * // will increment by 1, attaching also a `server_id` label
   * gauge.inc(1, {server_id: 'instance_1'})
   * ```
   *
   * @param value Value to increment with; default 1
   * @param tags Tags to attach to the increment; optional
   */
  inc(value = 1, tags?: Tags): void {
    console.log('Gauge.inc', value, tags);
    this.prometheusMetric.inc(tags || {}, value);
    this.statsdClient.gaugeDelta(this.statsdName, value, tags || {});
  }

  /**
   * Set method.
   *
   * ```typescript
   * const gauge = new Gauge('metric_gauge');
   *
   * // will set gauge value to 0 (the default value)
   * gauge.set(0);
   *
   * // will set gauge value to 10 (custom value)
   * gauge.set(10);
   *
   * // will set gauge value to 1, attaching also a `server_id` label
   * gauge.set(1, {server_id: 'instance_1'})
   * ```
   *
   * @param value Value to set with
   * @param tags Tags to attach to the increment; optional
   */
  set(value: number, tags?: Tags): void {
    this.prometheusMetric.set(tags || {}, value);
    this.statsdClient.gauge(this.statsdName, value, tags || {});
  }

  /**
   * Time method.
   *
   * See {@link Timer.startTimer} for usage.
   */
  startTimer(tags?: Tags): TimerEnd {
    return null;
  }
}

Gauge.prototype.startTimer = Timer.prototype.startTimer;
