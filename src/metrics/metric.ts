import { getStatsdClient } from '../statsd/utils';

export class Metric {

  protected statsdClient: any
  protected prometheusMetric: any

  constructor() {
      this.statsdClient = getStatsdClient()
  }
}
