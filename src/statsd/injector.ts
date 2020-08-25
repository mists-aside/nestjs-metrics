import { STATSD_CLIENT_LABEL } from './utils';
import { Inject } from "@nestjs/common";

export function InjectStatsdClient(): (target: object, key: string | symbol, index?: number | undefined) => void {
  return Inject(STATSD_CLIENT_LABEL);
}
