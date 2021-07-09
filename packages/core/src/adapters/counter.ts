// import {Injectable, Logger, Provider} from '@nestjs/common';

// import {MetricAdapter, MetricType} from '../enum';
// import {Errors} from '../errors';
// import {CountableOptions, Counter, LabelOptions} from '../interfaces';

// export interface IncMethod {
//   (labels: string[], value?: number): void;
// }

// export class CounterAdapter implements Counter {
//   adapter: MetricAdapter = MetricAdapter.Mock;
//   type: MetricType.Counter = MetricType.Counter;

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   inc(options: CountableOptions): void {
//     throw new Error(Errors.MethodNotImplemented('inc'));
//   }

//   reset(options: LabelOptions): void {
//     throw new Error(Errors.MethodNotImplemented('reset'));
//   }
// }
