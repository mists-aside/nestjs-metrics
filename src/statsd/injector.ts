import {Inject} from '@nestjs/common';

import {getToken} from './utils';

/**
 *
 * @param options
 */
export function InjectStatsdMetric(
  name: string,
): (target: object, key: string | symbol, index?: number | undefined) => void {
  const token = getToken(name);

  return Inject(token);
}
