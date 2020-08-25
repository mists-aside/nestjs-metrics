import {MetadataLabels} from './../metadata';
import 'reflect-metadata';

import {Config} from '../config';

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

const DummyStatsdClient = {
  counter: () => {
    return DummyStatsdClient;
  },
  increment: () => {
    return DummyStatsdClient;
  },
  decrement: () => {
    return DummyStatsdClient;
  },
  gauge: () => {
    return DummyStatsdClient;
  },
  set: () => {
    return DummyStatsdClient;
  },
  timing: () => {
    return DummyStatsdClient;
  },
  histogram: () => {
    return DummyStatsdClient;
  },
  close: () => {
    return DummyStatsdClient;
  },
};

/* eslint-enable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */

export const statsdClientProvider = {
  provide: 'StatsdClient',
  useFactory: (): unknown => {
    const metadata = MetadataLabels.getInstance().statsd;
    const config = Config.getInstance();
    if (!Reflect.hasMetadata(metadata, Config)) {
      let client = DummyStatsdClient;
      if (config.statsd) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const klass = require('statsd-client');
        client = new klass(config.statsd);
      }
      Reflect.defineMetadata(metadata, client, Config);
    }
    return Reflect.getMetadata(metadata, Config);
  },
};
