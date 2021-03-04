/* eslint-disable @typescript-eslint/no-empty-function */
import {Controller} from '@nestjs/common';

import {EventIncrement} from '../../decorators';
import {AdapterKinds} from '../../interfaces';
import {CounterMetric} from '../../metrics';

@Controller()
export class CounterMetricController {
  constructor(protected counter: CounterMetric) {}

  /** will increment all adapters */
  public incAllAdapters(): void {
    this.counter.inc();
  }

  /** will increment only prometheus adapters */
  public incByAdapter(adapter: AdapterKinds): void {
    this.counter.inc({
      adapter,
    });
  }

  /** will increment only adapters with a specific label  */
  public incByMetricLabel(metric: string): void {
    this.counter.inc({
      metric,
    });
  }

  /** will increment using different delta */
  public incWithDelta(): void {
    this.counter.inc({
      delta: 2,
    });
  }

  /** will increment using tags */
  public incWithDeltaAndTags(): void {
    this.counter.inc({
      delta: 2,
      tags: {tag: 'counter'},
    });
  }

  /** will increment using decorator */
  @EventIncrement()
  public async incWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
/* eslint-enable @typescript-eslint/no-empty-function */
