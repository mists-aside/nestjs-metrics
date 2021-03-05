import {CounterAdapter, GaugeAdapter, HistogramAdapter, SummaryAdapter} from '../adapters';
import {AdapterItem, Config} from '../config';
import {MetricKind} from '../interfaces';

export interface AdapterItemFilter {
  (value: AdapterItem, index: number, array: AdapterItem[]): unknown;
}

export class Metric {
  protected config = Config.getInstance();

  public searchAdapters(
    filter: string | MetricKind<CounterAdapter> | MetricKind<GaugeAdapter> | MetricKind<HistogramAdapter> | MetricKind<SummaryAdapter> | AdapterItemFilter,
  ): AdapterItem[] {
    if (typeof filter === 'function') {
      return this.config.adapters.filter(filter as AdapterItemFilter);
    }
    if (typeof filter === 'string') {
      return this.config.adapters.filter((adapter) => adapter.metric === filter);
    }
    return this.config.adapters.filter((adapterItem) => adapterItem.adapter.metricKind === filter.metricKind);
  }
}
