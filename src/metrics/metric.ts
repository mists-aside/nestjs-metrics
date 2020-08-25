import {getStatsdClient} from '../statsd/utils';

export class Metric {
  protected statsdClient: any;
  protected prometheusMetric: any;

  constructor(protected name: string) {
    this.statsdClient = getStatsdClient();
  }

  protected get statsdName(): string {
    return this.name.replace(/_/gi, '.');
  }
}
