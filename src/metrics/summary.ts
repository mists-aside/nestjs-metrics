import {Metrics} from '../metrics';
import {Histogram} from './histogram';
import {getPrometheusMetric} from '../prometheus/utils';
import {SummaryOptions} from './options';

export class Summary extends Histogram {
  constructor(protected name: string, protected options?: SummaryOptions) {
    super(name);

    this.prometheusMetric = getPrometheusMetric(Metrics.Summary, {
      ...(options.prometheus || {}),
      name,
      ...{help: options.prometheus ? options.prometheus.help || name : name},
    });
  }
}
