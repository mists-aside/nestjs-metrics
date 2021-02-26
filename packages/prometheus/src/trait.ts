// import * as prometheus from 'prom-client';

// export interface MetricFactory {
//   (label: string, availableTagKeys?: string[]): prometheus.Metric<string>;
// }
// export class Trait {
//   protected metrics: {[key: string]: prometheus.Metric<string>} = {};
//   protected availableTagKeys: string[];
//   protected factory: MetricFactory;

//   formLabel(label: string): string {
//     return `${label}::${this.availableTagKeys.join('|')}`;
//   }

//   prometheusMetricExists(label: string): boolean {
//     return prometheus.register.getMetricsAsArray().filter((m) => m.name == label).length === 1;
//   }

//   prometheusGetMetric(label: string): prometheus.Metric<string> {
//     return prometheus.register.getSingleMetric(label);
//   }

//   getMetric(
//     label: string,
//     configuration: {[key: string]: any},
//     metricClass: new (configuration: {[key: string]: any}) => prometheus.Metric<string>,
//   ) {
//     const localLabel = this.formLabel(label);

//     if (!this.metrics[localLabel]) {
//       this.metrics[localLabel] = this.prometheusMetricExists(localLabel)
//         ? prometheus.register.getSingleMetric(localLabel)
//         : this.factory
//         ? this.factory(localLabel, this.availableTagKeys)
//         : new metricClass(configuration);
//     }

//     return this.metrics[localLabel];
//   }
// }
