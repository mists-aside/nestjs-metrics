import {Tags} from '../options';
import {Metrics} from '../enum';
import {Metric, Timer, TimerEnd} from './generic';
import {HistogramOptions} from './options';

/**
 * Histogram Metric
 *
 * Histograms track sizes and frequency of ecents.
 * One more feature for histograms, is the timer metric which can record duration of events.
 *
 * ```typescript
 * const histogram = new Histogram('metric_histogram');
 *
 * // force prometheus settings
 * const histogram = new Histogram('metric_histogram', {
 *   prometheus: {
 *     help: 'This is a histogram metric'
 *   }
 * })
 *
 * // force statsd settings; if no settings are provided here,
 * // default settings will be used
 * const histogram = new Histogram('metric_histogram', {
 *   statsd: {
 *     host: 'localhost',
 *     socketTimeout: 2000,
 *   }
 * })
 * ```
 */
export class Histogram extends Metric {
  /**
   *
   * @param name Name used for the metric
   * @param options Options for the metric <br /> Depending on the metric technology used. Even though the MetricOptions
   *                support almost all options for each supported technology, be careful how you use and setup your
   *                options since they may generated strange behaviors that were not intended with this API.
   */
  constructor(name: string, options?: HistogramOptions) {
    super(name, Metrics.Histogram, options);
  }

  /**
   * Observe method.
   *
   * ```typescript
   * const histogram = new Histogram('metric_histogram');
   *
   * // will observe value 10 (custom value)
   * histogram.observe(10);
   *
   * // will observe value 1, attaching also a `server_id` label
   * histogram.observe(1, {server_id: 'instance_1'})
   * ```
   *
   * @param value Value to decrement with; default 1
   * @param tags Tags to attach to the increment; optional
   */
  observe(value: number, tags?: Tags): void {
    this.prometheusMetric.observe(tags || {}, value);
    this.statsdClient.histogram(this.statsdName, value, tags || {});
  }

  /**
   * Reset method.
   *
   * ```typescript
   * const histogram = new Histogram('metric_histogram');
   *
   * // will reset all histogram values
   * histogram.reset();
   *
   * ```
   *
   * @param value Value to decrement with; default 1
   * @param tags Tags to attach to the increment; optional
   */
  reset(): void {
    this.prometheusMetric.reset();
    this.statsdClient.histogram(this.statsdName, 0);
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

Histogram.prototype.startTimer = Timer.prototype.startTimer;
