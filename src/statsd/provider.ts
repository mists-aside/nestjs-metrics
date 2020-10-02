import {Provider} from '@nestjs/common';

import {Config} from '../config';
import {StatsDOptions} from './options';
import {getStatsdClient, getToken} from './utils';
import {StatsDClientAlike} from './options';

/**
 * To validate options typings, check the types `TcpOptions`, `UdpOptions`, `HttpOptions` defined in
 * {@link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/statsd-client/index.d.ts | @types/statsd-client}
 * and the {@link https://github.com/msiebuhr/node-statsd-client | statsd-client} project.
 *
 * ```typescript
 * import { Module } from "@nestjs/common";
 * import { MetricsModule } from "@mists/nestjs-metrics";
 * import { makeStatsdProvider } from "@mists/nestjs-metrics/dist/statsd";
 *
 * @Module({
 *   imports: [MetricsModule.register()],
 *   providers: [makeStatsdProvider('metrics_statsd_counter')],
 * })
 * export class AppModule {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeStatsdProvider(name: string, options?: StatsDOptions): Provider {
  options = options || Config.getInstance().statsd;
  return {
    provide: getToken(name),
    useFactory(): StatsDClientAlike {
      return getStatsdClient(name, options);
    },
  };
}
