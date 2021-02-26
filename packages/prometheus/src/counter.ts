import { AdapterKinds, CounterAdapter, CounterOptions } from '@mists/nestjs-metrics';
import { Counter, CounterConfiguration } from 'prom-client';


export class PrometheusCounterAdapter extends CounterAdapter {

  readonly adapterKind: 'prometheus': 'prometheus';

  readonly metricKind: 'counter' = 'counter';

  protected promCounter: Counter<string>;

  constructor(configuration: CounterConfiguration) {
    this.promCounter = new Counter(configuration)
  }

  /**
   * @see Counter.inc()
   * @param options
   */
  inc(options?: CounterOptions): void {

  }
}

// import {CounterAbstract, Tags} from '@mists/nestjs-metrics';
// import * as prometheus from 'prom-client';

// import {PrometheusInvalidLabelError} from './errors';
// import {Trait} from './trait';

// export interface CounterFactory {
//   (label: string, availableTagKeys?: string[]): prometheus.Counter<string>;
// }

// export class Counter extends CounterAbstract {
//   protected metrics: {[key: string]: prometheus.Counter<string>} = {};

//   protected factory: CounterFactory;
//   protected availableTagKeys: string[];

//   constructor(availableTagKeys: string[] = [], factory?: CounterFactory) {
//     super();
//     this.availableTagKeys = availableTagKeys;
//     this.factory = factory;
//   }

//   // formLabel(label: string) {
//   //   return `${label}::${this.availableTagKeys.join('|')}`;
//   // }

//   getCounter(label: string): prometheus.Counter<string> {
//     const localLabel = (this as any).formLabel(label);

//     return (this as any).getMetric(
//       label,
//       {
//         name: localLabel,
//         help: `Counter for ${localLabel}`,
//         labelNames: this.availableTagKeys,
//       },
//       prometheus.Counter,
//     ) as prometheus.Counter<string>;

//     // const localLabel = (this as any).formLabel(label);
//     // const metricsArray = prometheus.register.getMetricsAsArray();

//     // if (!this.counters[localLabel]) {
//     //   this.counters[localLabel] = metricsArray.filter((m) => m.name == localLabel).length
//     //     ? (prometheus.register.getSingleMetric(localLabel) as prometheus.Counter<string>)
//     //     : this.factory
//     //     ? this.factory(localLabel, this.availableTagKeys)
//     //     : new prometheus.Counter<string>({
//     //         name: localLabel,
//     //         help: `Counter for ${localLabel}`,
//     //         labelNames: this.availableTagKeys,
//     //       });
//     // }

//     // return this.counters[localLabel];
//   }

//   inc(delta?: number, label?: string, tags?: Tags): void {
//     if (!label) {
//       throw new PrometheusInvalidLabelError();
//     }
//     this.getCounter(label).inc(tags, delta);
//   }
// }

// Object.getOwnPropertyNames(Trait.prototype).forEach((key) => {
//   Counter.prototype[key] = Trait.prototype[key];
// });
