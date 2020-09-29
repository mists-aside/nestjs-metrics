/* eslint-disable @typescript-eslint/no-explicit-any */
import {getStatsdClient} from '../statsd/utils';
import {MetricOptions} from './options';
import {getPrometheusMetric} from '../prometheus/utils';
import {Metrics} from '../enum';
import {Tags} from '../options';

/**
 * Abstract Metric Class, used to extends all supported metrics.
 *
 * ```typescript
 * import { Metrics } from "@mists/nestjs-metrics";
 *
 * export class CustomMetric extends Metric {
 *   constructor(name: string, options: MetricOptions) {
 *     super(name, Metrics.Counter, options);
 *   }
 *
 *   // ...
 * }
 * ```
 */
export class Metric {
  /**
   * @link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts#L115
   */
  protected statsdClient: any;
  /**
   * @link https://github.com/siimon/prom-client/blob/master/index.d.ts#L114
   */
  protected prometheusMetric: any;

  /**
   *
   * @param name Name used for the metric
   * @param type Type of the metric
   * @param options Options for the metric <br /> Depending on the metric technology used. Even though the MetricOptions
   *                support almost all options for each supported technology, be careful how you use and setup your
   *                options since they may generated strange behaviors that were not intended with this API.
   */
  constructor(protected name: string, type: Metrics, protected options: MetricOptions) {
    this.statsdClient = getStatsdClient(name, options.statsd || 'dummy');

    this.prometheusMetric = getPrometheusMetric(type, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }

  protected get statsdName(): string {
    return this.name.replace(/_/gi, '.');
  }
}

/**
 *
 */
export type TimerEnd = (newTags?: Tags) => void;

/**
 * Timer Trait Class
 *
 * <i>This class is not used as standalone and it cannot be instantiated by itself. Its prototype is copied to classes
 * like {@link Gauge.startTimer | Gauge}, {@link Histogram.startTimer | Histogram} or
 * {@link Summary.startTimer | Summary} to fulfill the timing functionality.</i>
 */
export class Timer {
  /**
   * @ignore
   */
  protected statsdClient: any;
  /**
   * @ignore
   */
  protected prometheusMetric: any;
  /**
   * @ignore
   */
  protected statsdName: any;
  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  /**
   * Timer initialization method
   *
   * ```typescript
   * const gauge = new Gauge('timing_is_everything');
   * const endTimer = gauge.startTimer();
   * setTimeout(endTimer, 2000);
   * // or
   * setTimeout(() => { endTimer(/* list of tags *\/); }, 2000)
   * ```
   *
   * @param tags Optional tags to be sent with the metric
   * @return A function that needs to be called when the timer should end. The end method has a {@link Tags}
   *         argument as well, giving you the possibility to add additional tags at end of timer call.
   */
  startTimer(tags?: Tags): TimerEnd {
    const prometheusEnd = this.prometheusMetric.startTimer(tags || {});
    const stasdStart = new Date();

    return (newTags?: Tags): void => {
      prometheusEnd(newTags || tags || {});
      this.statsdClient.timing(this.statsdName, stasdStart, newTags || tags || {});
    };
  }
}
