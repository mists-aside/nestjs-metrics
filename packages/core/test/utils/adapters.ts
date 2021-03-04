import * as sinon from 'sinon';

import {CounterAdapter, GaugeAdapter} from '../../src/adapters';
import {AdapterKinds, EndTimerMethod, TimerOptions} from '../../src/interfaces';
import {CountableMetricOptions} from '../../src/metrics';

export class CounterPrometheus extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableMetricOptions): void {
    return;
  }
}

export const endTimer = sinon.fake();

export class CounterStatsd extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableMetricOptions): void {
    return;
  }
}

export class GaugePrometheus extends GaugeAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dec(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }
}

export class GaugeStatsd extends GaugeAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dec(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }
}
