// import {AdapterObserveOptions, AdapterResetOptions} from '../interfaces';
// import {Injectable} from '@nestjs/common';

// import {Adapter, Histogram as HistogramInterface, Tags, TimerMethod} from '../interfaces';
// import {Metric} from './metric';
// import {StartTimerOptions} from './gauge';

// export interface ObserveOptions extends AdapterObserveOptions {
//   adapter?: string;
// }

// export interface ResetOptions extends AdapterResetOptions {
//   adapter?: string;
// }

// @Injectable()
// export class Histogram extends Metric {
//   protected static instance: Histogram;

//   static getInstance(): Histogram {
//     if (!Histogram.instance) {
//       Histogram.instance = new Histogram();
//     }
//     return Histogram.instance;
//   }

//   observe(options?: ObserveOptions): void {
//     const {adapter, label, tags, value} = Object.assign(
//       {
//         value: 1,
//       },
//       options || {},
//     );
//     this.histogramAdapters(adapter).forEach((histogram) => histogram.observe({label, tags, value}));
//   }

//   reset(options?: ResetOptions): void {
//     const {adapter, label, tags} = Object.assign({}, options || {});
//     this.histogramAdapters(adapter).forEach((histogram) => histogram.reset({label, tags}));
//   }

//   startTimer(options?: StartTimerOptions): TimerMethod[] {
//     const {adapter, label, tags} = Object.assign({}, options || {});
//     return this.histogramAdapters(adapter).map((gauge) => gauge.startTimer({label, tags}));
//   }

//   protected histogramAdapters(adapter?: string): HistogramInterface[] {
//     return this.searchAdapters(
//       adapter ? adapter : (value: Adapter): unknown => value.kind === 'histogram',
//     ) as HistogramInterface[];
//   }
// }
