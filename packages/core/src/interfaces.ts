/***************************************************************************
 * Metric
 */

export type MetricKinds = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface Metric {
  metricKind: MetricKinds;
}

export type MetricKind<T extends Metric> = Pick<T, 'metricKind'>;

/***************************************************************************
 * Adapter
 */

export type AdapterKinds = 'prometheus' | 'statsd';

export interface Adapter extends Metric {
  adapterKind: AdapterKinds;
}

// export type AdapterKind<T extends Adapter> = Pick<T, 'adapterKind'>;

/***************************************************************************
 * Metric Options
 */

export interface Tags {
  [key: string]: string | number;
}

/***************************************************************************
 * Counter
 */

/**
 * @see StatsdClient.increment(metric: string, delta?: number, tags?: StatsdClient.Tags);
 * @see MetricConfiguration<T>
 */
export interface CounterOptions {
  delta?: number;
  tags?: Tags;
}

export interface Counter extends Metric {
  metricKind: 'counter';

  /**
   * @link https://github.com/siimon/prom-client#counter
   * @see ../node_modules/prom-client/index.d.ts
   * @link https://github.com/msiebuhr/node-statsd-client#counting-stuff
   * @see ../node_modules/@types/statsd-client/index.d.ts
   *
   * @param options
   */
  inc(options?: CounterOptions): void;
}

/***************************************************************************
 * Gauge
 */

/**
 * @see StatsdClient.increment(metric: string, delta?: number, tags?: StatsdClient.Tags);
 * @see MetricConfiguration<T>
 */
export interface TimerOptions {
  tags?: Tags;
}

export interface EndTimerMethod {
  (options?: TimerOptions): void;
}

/**
 * @link https://github.com/siimon/prom-client#gauge
 * @see ../node_modules/prom-client/index.d.ts
 * @link https://github.com/msiebuhr/node-statsd-client#counting-stuff
 * @see ../node_modules/@types/statsd-client/index.d.ts
 *
 * @param options
 */
export interface Gauge extends Metric {
  metricKind: 'gauge';

  inc(options?: CounterOptions): void;

  dec(options?: CounterOptions): void;

  set(options?: CounterOptions): void;

  startTimer(options?: TimerOptions): EndTimerMethod;
}

// export type KIND_COUNTER = 'counter';
// export type KIND_GAUGE = 'gauge';
// export type KIND_HISTOGRAM = 'histogram';
// export type KIND_SUMMARY = 'summary';

// export type KIND_METRIC = KIND_COUNTER | KIND_GAUGE | KIND_HISTOGRAM | KIND_SUMMARY;

// export interface TimerMethod {
//   (tags?: Tags): void;
// }

// export interface Counter {
//   kind: KIND_COUNTER;
//   inc(options?: AdapterIncOptions): void;
// }

// export interface AdapterStartTimerOptions extends Omit<AdapterIncOptions, 'value'> {}

// interface Timer {
//   startTimer(options?: AdapterStartTimerOptions): TimerMethod;
// }

// export interface AdapterDecOptions extends AdapterIncOptions {}

// export interface AdapterSetOptions extends Omit<AdapterIncOptions, 'delta'> {
//   value?: number;
// }

// export interface Gauge extends Timer {
//   kind: KIND_GAUGE;
//   dec(options?: AdapterDecOptions): void;
//   inc(options?: AdapterIncOptions): void;
//   set(options?: AdapterSetOptions): void;
// }

// export interface AdapterObserveOptions extends AdapterSetOptions {}

// export interface AdapterResetOptions extends Omit<AdapterIncOptions, 'delta'> {}

// export interface Histogram extends Timer {
//   kind: KIND_HISTOGRAM;
//   observe(options?: AdapterObserveOptions): void;
//   reset(options?: AdapterResetOptions): void;
// }

// export interface Summary extends Timer {
//   kind: KIND_SUMMARY;
//   observe(options?: AdapterObserveOptions): void;
//   reset(options?: AdapterResetOptions): void;
// }

// export type AdapterType = Type<Counter | Gauge | Histogram | Summary>;

// export type Adapter = Counter | Gauge | Histogram | Summary;
