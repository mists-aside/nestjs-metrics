import {Inject} from '@nestjs/common';
import {getToken} from './utils';

export function InjectPrometheusMetric(
  name: string,
): (target: object, key: string | symbol, index?: number | undefined) => void {
  const token = getToken(name);

  return Inject(token);
}
