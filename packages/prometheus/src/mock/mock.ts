import {Counter, Gauge, Histogram, LabelValues, MetricConfiguration, Summary} from 'prom-client';

type TypeOfMetric = typeof Counter | typeof Gauge | typeof Histogram | typeof Summary;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function promMock<T extends string>(klass: TypeOfMetric): any {
  class PromMock extends klass<T> {
    protected name: string;

    constructor(configuration: MetricConfiguration<T>) {
      super(configuration);

      this.name = configuration.name;
    }

    protected parseArgs(labels?: LabelValues<T> | number | null, value?: number): unknown {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let options: Record<string, any> = {
        name: this.name,
        labels: typeof labels === 'number' ? null : labels,
      };

      if (value) {
        options = {
          ...options,
          value: typeof labels === 'number' ? labels : value,
        };
      }

      return options;
    }
  }

  return PromMock;
}
