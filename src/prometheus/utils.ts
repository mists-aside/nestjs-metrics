import {
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  Metric,
  SummaryConfiguration,
} from 'prom-client';

import {Config} from '../config';
import {Metrics} from '../metrics';

export type PrometheusMetricOptions =
  | GaugeConfiguration<string>
  | SummaryConfiguration<string>
  | CounterConfiguration<string>
  | HistogramConfiguration<string>;

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

export const DummyCounter = {
  inc: (): void => {},
};

export const DummyTimer = {
  startTimer: (): (() => void) => () => {},
};

export const DummyGauge = {
  ...DummyCounter,
  dec: (): void => {},
  set: (): void => {},
  ...DummyTimer,
};

export const DummyHistogram = {
  observe: (): void => {},
  ...DummyTimer,
};

const metrics = {
  [Metrics.Counter]: DummyCounter,
  [Metrics.Gauge]: DummyGauge,
  [Metrics.Histogram]: DummyHistogram,
  [Metrics.Summary]: DummyHistogram,
};

/* eslint-enable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

export const getToken = (name: string): string => `PROMETHEUS_METRIC_${name.toUpperCase()}`;

export const getPrometheusMetric = (type: Metrics, options: PrometheusMetricOptions): Metric<string> => {
  const config = Config.getInstance();

  if (!config.prometheus) {
    return metrics[type] as Metric<string>;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PromClient = require('prom-client');
  const register = config.prometheus
    ? config.prometheus.defaultMetrics.config.register || PromClient.register
    : PromClient.register;

  const existing = register.getSingleMetric(options.name);
  if (existing) {
    return existing;
  }

  switch (type) {
    case Metrics.Counter:
      return new PromClient.Counter({
        ...(config.prometheus.counter || {}),
        ...options,
      });
    case Metrics.Gauge:
      return new PromClient.Gauge({
        ...(config.prometheus.gauge || {}),
        ...options,
      });
    case Metrics.Histogram:
      return new PromClient.Histogram({
        ...(config.prometheus.histogram || {}),
        ...options,
      });
    case Metrics.Summary:
      return new PromClient.Summary({
        ...(config.prometheus.summary || {}),
        ...options,
      });
    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
};
