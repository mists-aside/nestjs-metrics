/* eslint-disable @typescript-eslint/no-explicit-any */

import {Tags} from '../options';

/**
 * Dummy clone of {@link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts | StatsDClient}
 *
 * @ignore
 */
export interface StatsDClientAlike {
  counter(metric: string, delta: number, tags?: Tags): this;
  increment(metric: string, delta?: number, tags?: Tags): this;
  decrement(metric: string, delta?: number, tags?: Tags): this;
  gauge(name: string, value: number, tags?: Tags): this;
  gaugeDelta(name: string, delta: number, tags?: Tags): this;
  set(name: string, value: number, tags?: Tags): this;
  timing(name: string, startOrDuration: Date | number, tags?: Tags): this;
  histogram(name: string, value: number, tags?: Tags): this;
}

/**
 * To validate options typings, check the types `StatsdHttpOptions`, `StatsdTcpOptions`, `StatsdUdpOptions` defined in
 * {@link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts | @types/statsd-client}
 * and the {@link https://github.com/msiebuhr/node-statsd-client | statsd-client} project.
 */
export type StatsDOptions = {[key: string]: any} | 'dummy';
