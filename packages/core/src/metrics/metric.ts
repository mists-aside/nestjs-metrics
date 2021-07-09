import {Adapter, AdapterFilter, AdapterType} from '../adapter';
import {Config} from '../config';

export interface MetricOptions {
  adapterType?: AdapterType;
  adapterFilter?: AdapterFilter;
}

export class Metric {
  protected getAdapters(options: MetricOptions): Adapter[] {
    return Config.getInstance().getAdapters((adapter: Adapter) => {
      return (
        (options.adapterType ? options.adapterType == adapter.adapterType : true) ||
        (options.adapterFilter ? options.adapterFilter(adapter) : true)
      );
    });
  }
}
