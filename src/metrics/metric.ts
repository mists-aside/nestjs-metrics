/* eslint-disable @typescript-eslint/no-explicit-any */
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

type Constructor = typeof Metric;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function Timer(Base: Constructor = Metric): Constructor {
  return class extends Base {
    startTimer(): () => void {
      const prometheusEnd = this.prometheusMetric.startTimer();
      const stasdStart = new Date();

      return (): void => {
        prometheusEnd();
        this.statsdClient.histogram(this.statsdName, stasdStart);
      };
    }
  };
}
