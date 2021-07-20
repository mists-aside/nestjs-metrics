import * as sinon from 'sinon';

import {CounterAdapter, GaugeAdapter, HistogramAdapter, SummaryAdapter} from '../../src/adapters';
import {AdapterKinds, EndTimerMethod, TimerOptions} from '../../src/interfaces';
import {CountableMetricOptions} from '../../src/metrics';

export class CounterPrometheus extends CounterAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inc(options?: CountableMetricOptions): void {
    return;
  }

  reset(): void {
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

  reset(): void {
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

  reset(): void {
    return;
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

  reset(): void {
    return;
  }
}

export class HistogramPrometheus extends HistogramAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }

  reset(): void {
    return;
  }
}

export class HistogramStatsd extends HistogramAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }

  reset(): void {
    return;
  }
}

export class SummaryPrometheus extends SummaryAdapter {
  readonly adapterKind: AdapterKinds = 'prometheus';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }

  reset(): void {
    return;
  }
}

export class SummaryStatsd extends SummaryAdapter {
  readonly adapterKind: AdapterKinds = 'statsd';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(options?: CountableMetricOptions): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTimer(options?: TimerOptions): EndTimerMethod {
    return endTimer;
  }

  reset(): void {
    return;
  }
}
