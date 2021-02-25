// import {Injectable} from '@nestjs/common';

// import {Adapter, Summary as SummaryInterface, Tags, TimerMethod} from '../interfaces';
// import {StartTimerOptions} from './gauge';
// import {ObserveOptions, ResetOptions} from './histogram';
// import {Metric} from './metric';

// @Injectable()
// export class Summary extends Metric {
//   protected static instance: Summary;

//   static getInstance(): Summary {
//     if (!Summary.instance) {
//       Summary.instance = new Summary();
//     }
//     return Summary.instance;
//   }

//   observe(options?: ObserveOptions): void {
//     const {adapter, label, tags, value} = Object.assign(
//       {
//         value: 1,
//       },
//       options || {},
//     );
//     this.summaryAdapters(adapter).forEach((histogram) => histogram.observe({label, tags, value}));
//   }

//   reset(options?: ResetOptions): void {
//     const {adapter, label, tags} = Object.assign({}, options || {});
//     this.summaryAdapters(adapter).forEach((histogram) => histogram.reset({label, tags}));
//   }

//   startTimer(options?: StartTimerOptions): TimerMethod[] {
//     const {adapter, label, tags} = Object.assign({}, options || {});
//     return this.summaryAdapters(adapter).map((gauge) => gauge.startTimer({label, tags}));
//   }

//   protected summaryAdapters(adapter?: string): SummaryInterface[] {
//     return this.searchAdapters(
//       adapter ? adapter : (value: Adapter): unknown => value.kind === 'summary',
//     ) as SummaryInterface[];
//   }
// }
