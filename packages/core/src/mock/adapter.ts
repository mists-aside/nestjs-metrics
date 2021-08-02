import {Adapter, Counter} from '../interfaces';
import {MockCounter} from './counter';

export class MockAdapter implements Adapter {
  constructor(public readonly adapterLabel: string) {}

  getCounter(): Counter {
    return MockCounter.getInstance(this.adapterLabel);
  }
}
