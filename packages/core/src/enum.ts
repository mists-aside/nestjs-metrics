export enum MetricType {
  Counter,
  Gauge,
  Histogram,
  Summary,
}

export enum MetricAdapter {
  Mock,
  Prometheus,
  Statsd,
}
