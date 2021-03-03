import {CounterAdapter, GaugeAdapter} from '../../src/adapters';
import {AdapterKinds, EndTimerMethod, TimerOptions} from '../../src/interfaces';
import {GaugeIncDecOptions} from '../../src/metrics';
import * as sinon from 'sinon';

export class CounterPrometheus extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: GaugeIncDecOptions): void {
    return;
  }
}

export const endTimer = sinon.fake()

export class CounterStatsd extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: GaugeIncDecOptions): void {
    return;
  }
}

export class GaugePrometheus extends GaugeAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dec(options?: GaugeIncDecOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: GaugeIncDecOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options?: GaugeIncDecOptions): void {
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
  dec(options?: GaugeIncDecOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: GaugeIncDecOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(options?: GaugeIncDecOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }
}
