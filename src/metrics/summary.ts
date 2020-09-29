import {Metrics} from '../enum';
import {Histogram} from './histogram';
import {SummaryOptions} from './options';
import {getPrometheusMetric} from '../prometheus/utils';

/**
 * Summary Metric
 *
 * Summaries calculate percentiles of observed values.
 * One more feature for summaries, is the timer metric which can record duration of events.
 *
 * > Note that from <b>statsd</b> point of view, summaries are treated as histograms.
 *
 * ```typescript
 * const summary = new Summary('metric_summary');
 *
 * // force prometheus settings
 * const summary = new Summary('metric_summary', {
 *   prometheus: {
 *     help: 'This is a summary metric'
 *   }
 * })
 *
 * // force statsd settings; if no settings are provided here,
 * // default settings will be used
 * const summary = new Summary('metric_summary', {
 *   statsd: {
 *     host: 'localhost',
 *     socketTimeout: 2000,
 *   }
 * })
 * ```
 */
export class Summary extends Histogram {
  constructor(name: string, options?: SummaryOptions) {
    super(name, options);

    this.prometheusMetric = getPrometheusMetric(Metrics.Summary, {
      ...(this.options.prometheus || {}),
      name,
      ...{help: this.options.prometheus ? this.options.prometheus.help || name : name},
    });
  }
}
