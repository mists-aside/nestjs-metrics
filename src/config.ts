import {
  CounterConfiguration,
  DefaultMetricsCollectorConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
} from 'prom-client';

/****************************************************************
 * PROMETHEUS
 ****************************************************************/

export interface PrometheusDefaultMetricsOptions {
  enabled?: boolean;
  config: DefaultMetricsCollectorConfiguration;
}

export interface PrometheusOptions {
  // default values for counter metric
  counter?: Partial<Omit<CounterConfiguration<string>, 'name' | 'help'>>;
  // default options options
  defaultMetrics: PrometheusDefaultMetricsOptions;
  // default options for gauge metric
  gauge?: Partial<Omit<GaugeConfiguration<string>, 'name' | 'help'>>;
  // default options for histogram metric
  histogram?: Partial<Omit<HistogramConfiguration<string>, 'name' | 'help'>>;
  // route to read metrics from
  route?: string;
  // default options for summary metric
  summary?: Partial<Omit<SummaryConfiguration<string>, 'name' | 'help'>>;
}

export const defaultPrometheusOptions: PrometheusOptions = {
  defaultMetrics: {
    enabled: true,
    config: {
      // register: require('prom-client').register
    },
  },
  route: '/metrics',
};

/****************************************************************
 * STATSD
 ****************************************************************/

export interface Tags {
  [key: string]: string | number;
}

interface StatsdCommonOptions {
  /**
   * Prefix all stats with this value (default "").
   */
  prefix?: string;

  /**
   * Print what is being sent to stderr (default false).
   */
  debug?: boolean;

  /**
   * Object of string key/value pairs which will be appended on
   * to all StatsD payloads (excluding raw payloads)
   * (default {})
   */
  tags?: Tags;

  /**
   * User specifically wants to use tcp (default false)
   */
  tcp?: boolean;

  /**
   * Dual-use timer. Will flush metrics every interval. For UDP,
   * it auto-closes the socket after this long without activity
   * (default 1000 ms; 0 disables this). For TCP, it auto-closes
   * the socket after socketTimeoutsToClose number of timeouts
   * have elapsed without activity.
   */
  socketTimeout?: number;
}

interface StatsdTcpOptions extends StatsdCommonOptions {
  /**
   * Where to send the stats (default localhost).
   */
  host?: string;

  /**
   * Port to contact the statsd-daemon on (default 8125).
   */
  port?: number;

  /**
   * Number of timeouts in which the socket auto-closes if it
   * has been inactive. (default 10; 1 to auto-close after a
   * single timeout).
   */
  socketTimeoutsToClose: number;
}

interface StatsdUdpOptions extends StatsdCommonOptions {
  /**
   * Where to send the stats (default localhost).
   */
  host?: string;

  /**
   * Port to contact the statsd-daemon on (default 8125).
   */
  port?: number;
}

interface StatsdHttpOptions extends StatsdCommonOptions {
  /**
   * Where to send the stats (default localhost).
   */
  host?: string;

  /**
   * Additional headers to send (default {}).
   */
  headers?: {[index: string]: string};

  /**
   * What HTTP method to use (default "PUT").
   */
  method?: string;
}

export type StatsdOptions = StatsdHttpOptions | StatsdTcpOptions | StatsdUdpOptions;

/****************************************************************
 * CONFIG
 ****************************************************************/

export enum StatsTypes {
  // // https://collectd.org/
  // Collectd,
  // // https://docs.fluentd.org/
  // Fluentd,
  // https://prometheus.io/
  Prometheus,
  // https://github.com/statsd/statsd
  Statsd,
}

export interface StatsOptions {
  types?: StatsTypes[];
  prometheus?: PrometheusOptions;
  statsd?: StatsdOptions;
}

export class Config {
  private static instance: Config;

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private cTypes: StatsTypes[] = [];
  private cPrometheus?: PrometheusOptions;
  private cStatsd?: StatsdOptions;

  public get prometheus(): PrometheusOptions | undefined {
    return this.cPrometheus;
  }

  public setPrometheusOptions(options: PrometheusOptions): void {
    this.cPrometheus = options;
  }

  public setStatsdOptions(options: StatsdOptions): void {
    this.cStatsd = options;
  }

  public setTypes(types: StatsTypes[]): void {
    this.cTypes = types;
  }

  public get statsd(): StatsdOptions | undefined {
    return this.cStatsd;
  }

  public get types(): StatsTypes[] {
    return this.cTypes;
  }
}
