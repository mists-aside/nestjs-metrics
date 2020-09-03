export interface Tags {
  [key: string]: string | number;
}

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
