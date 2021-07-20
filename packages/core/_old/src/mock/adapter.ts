import {Adapter, AdapterType} from '../adapter';
import {MetricType} from '../enum';

export class MockAdapter extends Adapter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMetric(metricType: MetricType): unknown {
    return null;
  }
}
