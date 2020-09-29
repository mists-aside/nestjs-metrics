import {Provider} from '@nestjs/common';

import {Config} from '../config';
import {StatsdOptions} from './options';
import {getStatsdClient, getToken} from './utils';
import {StatsdClientAlike} from './options';

/**
 * > To validate options typings, check the types `StatsdHttpOptions`, `StatsdTcpOptions`, `StatsdUdpOptions` defined in
 * > [@types/statsd-client](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts)
 * > and the [statsd-client](https://github.com/msiebuhr/node-statsd-client) project.
 * @param options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeStatsdProvider(name: string, options?: StatsdOptions): Provider {
  options = options || Config.getInstance().statsd;
  return {
    provide: getToken(name),
    useFactory(): StatsdClientAlike {
      return getStatsdClient(name, options);
    },
  };
}
