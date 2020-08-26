import {Config} from '../config';

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

export const STATSD_CLIENT_LABEL = 'StatsdClient';

export const DummyStatsdClient = {
  counter: () => {
    return DummyStatsdClient;
  },
  gauge: () => {
    return DummyStatsdClient;
  },
  gaugeDelta: () => {
    return DummyStatsdClient;
  },
  increment: () => {
    return DummyStatsdClient;
  },
  histogram: () => {
    return DummyStatsdClient;
  },
  timing: () => {
    return DummyStatsdClient;
  },
};

/* eslint-enable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStatsdClient = (): any => {
  const config = Config.getInstance();
  let client = DummyStatsdClient;
  if (config.statsd) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const klass = require('statsd-client');
    client = new klass(config.statsd);
  }
  return client;
};
