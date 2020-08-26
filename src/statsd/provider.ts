import {Provider} from '@nestjs/common';

import {getStatsdClient, STATSD_CLIENT_LABEL} from './utils';

export const statsdClientProvider: Provider = {
  provide: STATSD_CLIENT_LABEL,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (): any => getStatsdClient(),
};
