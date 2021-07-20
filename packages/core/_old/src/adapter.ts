import {MetricType} from './enum';
import {Errors} from './errors';

export enum AdapterType {
  Mock,
  Prometheus,
  Statsd,
}

export interface AdapterOptions {
  name: string;
  options?: unknown;
}

/**
 * Adapter (abstract) class should reflect metric adapters: Prometheus, statsd,
 * etc.
 */
export class Adapter {
  public readonly adapterType: AdapterType = AdapterType.Mock;

  constructor(protected options: AdapterOptions) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMetric(metricType: MetricType): unknown {
    // TODO: better definition of the getMetric() method
    throw new Error(Errors.MethodNotImplemented('getMetric'));
  }

  get adapterName(): string {
    return this.options.name;
  }

  get adapterOptions(): unknown {
    return this.options.options;
  }
}

export interface AdapterFilter {
  (adapter: Adapter): boolean;
}
