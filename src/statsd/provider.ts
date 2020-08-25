import {Provider} from '@nestjs/common';

import {getStatsdClient, STATSD_CLIENT_LABEL} from './utils';

export const statsdClientProvider: Provider = {
  provide: STATSD_CLIENT_LABEL,
  useFactory: (): any => getStatsdClient(),
};
