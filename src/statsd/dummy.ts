/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type */

/**
 * See definition of `StatsdClient` from the [statsd-client](https://github.com/msiebuhr/node-statsd-client) project
 */
export const DummyStatsdClient = {
  counter: (...args: any[]) => DummyStatsdClient,
  increment: (...args: any[]) => DummyStatsdClient,
  decrement: (...args: any[]) => DummyStatsdClient,
  gauge: (...args: any[]) => DummyStatsdClient,
  gaugeDelta: (...args: any[]) => DummyStatsdClient,
  set: (...args: any[]) => DummyStatsdClient,
  timing: (...args: any[]) => DummyStatsdClient,
  histogram: (...args: any[]) => DummyStatsdClient,
  raw: (...args: any[]) => DummyStatsdClient,
  close: () => DummyStatsdClient,
  getChildClient: (...args: any[]) => DummyStatsdClient,
  formatTags: (...args: any[]) => JSON.stringify({...args}),
};
