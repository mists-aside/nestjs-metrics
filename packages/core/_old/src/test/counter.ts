// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// /* eslint-disable @typescript-eslint/no-empty-function */

// import {Controller, Logger} from '@nestjs/common';

// import {MetricAdapter, MetricType} from '../../index';

// // import {MetricInc, MetricReset} from '../../decorators';
// // import {AdapterKinds} from '../../interfaces';
// // import {CounterMetric} from '../../metrics';

// @Controller()
// export class CounterMetricController {
//   private logger = new Logger('CounterMetricController');

//   constructor(protected metrics: Metrics) {}

//   /**************************************************************************
//    * Using @Inc decorator
//    */

//   @Inc({label: 'inc_metric_1'})
//   public withDecoratorIncAllAdapters() {
//     this.logger.debug('with decorator, inc all adapters using specified label');
//   }

//   @Inc({label: ['inc_metric_1', 'inc_metric_2']})
//   public withDecoratorIncMultipleLabelsOnAllAdapters() {
//     this.logger.debug('with decorator, inc all adapters using specified label(s)');
//   }

//   @Inc({label: 'inc_metric_1', value: 2})
//   public withDecoratorIncAllAdaptersWithValue() {
//     this.logger.debug('with decorator, inc all adapters with a specific value');
//   }

//   @Inc({label: 'inc_metric_1', type: MetricType.Counter})
//   public withDecoratorIncCounterByType() {
//     this.logger.debug('with decorator, inc all adapters, filtering by type');
//   }

//   @Inc({label: 'inc_metric_1', adapter: MetricAdapter.Prometheus})
//   public withDecoratorIncCounterByAdapter() {
//     this.logger.debug('with decorator, inc all adapters, filtering by adapter');
//   }

//   @Inc({label: 'inc_metric_1', label: (metric) => metric.type === MetricType.Counter})
//   public withDecoratorIncCounterAdaptersByFilter() {
//     this.logger.debug('with decorator, inc all adapters, filtering with callable');
//   }

//   /**************************************************************************
//    * Using injected
//    */

//   /** will increment all adapters */
//   public withInjectedIncAllAdapters(): void {
//     this.metrics.inc({label: 'inc_metric_1'});
//     this.logger.debug('with injected, inc all adapters using specified label');
//   }

//   public withInjectedIncMultipleLabelsOnAllAdapters(): void {
//     this.metrics.inc({label: ['inc_metric_1', 'inc_metric_2']});
//     this.logger.debug('with injected, inc all adapters using specified label(s)');
//   }

//   public withInjectedIncAllAdaptersWithValue() {
//     this.metrics.inc({label: 'inc_metric_1', value: 2});
//     this.logger.debug('with injected, inc all adapters with a specific value');
//   }

//   public withInjectedIncCounterByType() {
//     this.metrics.inc({label: 'inc_metric_1', type: MetricType.Counter});
//     this.logger.debug('with injected, inc all adapters, filtering by type');
//   }

//   public withInjectedIncCounterByAdapter() {
//     this.metrics.inc({label: 'inc_metric_1', adapter: MetricAdapter.Prometheus});
//     this.logger.debug('with injected, inc all adapters, filtering by adapter');
//   }

//   public withInjectedIncCounterAdaptersByFilter() {
//     this.metrics.inc({label: 'inc_metric_1', filter: (metric) => metric.type === MetricType.Counter});
//     this.logger.debug('with injected, inc all adapters, filtering with callable');
//   }

//   // /** will increment only prometheus adapters */
//   // public incByAdapter(adapter: AdapterKinds): void {
//   //   this.counter.inc({
//   //     adapter,
//   //   });
//   // }

//   // /** will increment only adapters with a specific label  */
//   // public incByMetricName(metric: string): void {
//   //   this.counter.inc({
//   //     metric,
//   //   });
//   // }

//   // /** will increment using different delta */
//   // public incWithDelta(): void {
//   //   this.counter.inc({
//   //     delta: 2,
//   //   });
//   // }

//   // /** will increment using tags */
//   // public incWithDeltaAndTags(): void {
//   //   this.counter.inc({
//   //     delta: 2,
//   //     tags: {tag: 'counter'},
//   //   });
//   // }

//   // /** will increment using decorator */
//   // @MetricInc({adapter: 'prometheus'}, {metricKind: 'counter'})
//   // public async incWithDecorator(): Promise<void> {
//   //   await new Promise((resolve) => setTimeout(resolve, 500));
//   // }

//   // // reset

//   // /** will reset all adapters */
//   // public resetAllAdapters(): void {
//   //   this.counter.reset();
//   // }

//   // /** will reset only prometheus adapters */
//   // public resetByAdapter(adapter: AdapterKinds): void {
//   //   this.counter.reset({
//   //     adapter,
//   //   });
//   // }

//   // /** will reset only adapters with a specific label  */
//   // public resetByMetricName(metric: string): void {
//   //   this.counter.reset({
//   //     metric,
//   //   });
//   // }

//   // /** will increment using decorator */
//   // @MetricReset({adapter: 'prometheus'}, {metricKind: 'counter'})
//   // public async resetWithDecorator(): Promise<void> {
//   //   await new Promise((resolve) => setTimeout(resolve, 500));
//   // }
// }
// /* eslint-enable @typescript-eslint/no-empty-function */
