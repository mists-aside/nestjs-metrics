import {CounterAdapter, GaugeAdapter} from '../../src/adapters';
import {AdapterKinds, EndTimerMethod, TimerOptions} from '../../src/interfaces';
import {GaugeIncDecOptions} from '../../src/metrics';

export class CounterPrometheus extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: GaugeIncDecOptions): void {
    return;
  }
}

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
    return;
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
    return;
  }
}
