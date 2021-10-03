import {Adapter, Counter, Gauge, Histogram, Summary} from '../interfaces';
import {MockCounter} from './counter';
import {MockGauge} from './gauge';
import {MockHistogram} from './histogram';
import {MockSummary} from './summary';

export class MockAdapter implements Adapter {
  constructor(public readonly adapterLabel: string) {}

  getCounter(): Counter {
    return MockCounter.getInstance(this.adapterLabel);
  }

  getGauge(): Gauge {
    return MockGauge.getInstance(this.adapterLabel);
  }

  getHistogram(): Histogram {
    return MockHistogram.getInstance(this.adapterLabel);
  }

  getSummary(): Summary {
    return MockSummary.getInstance(this.adapterLabel);
  }
}
