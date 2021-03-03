/* eslint-disable @typescript-eslint/no-empty-function */
import {Controller} from '@nestjs/common';

import {EventIncrement} from '../../decorators';
import {AdapterKinds} from '../../interfaces';
import {GaugeMetric} from '../../metrics';

@Controller()
export class GaugeMetricController {
  constructor(protected gauge: GaugeMetric) {}

  /** will increment all adapters */
  public decAllAdapters(): void {
    this.gauge.dec();
  }

  /** will decrement only prometheus adapters */
  public decByAdapter(adapter: AdapterKinds): void {
    this.gauge.dec({
      adapter,
    });
  }

  /** will decrement only adapters with a specific label  */
  public decByMetricLabel(metric: string): void {
    this.gauge.dec({
      metric,
    });
  }

  /** will decrement using different delta */
  public decWithDelta(): void {
    this.gauge.dec({
      delta: 2,
    });
  }

  /** will decrement using tags */
  public decWithDeltaAndTags(): void {
    this.gauge.dec({
      tags: {tag: 'gauge'},
    });
  }

  // TODO: add EventDecrement()
  // /** will decrement using decorator */
  // @EventIncrement()
  // public async decWithDecorator(): Promise<void> {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  // }

  /** will increment all adapters */
  public incAllAdapters(): void {
    this.gauge.inc();
  }

  /** will increment only prometheus adapters */
  public incByAdapter(adapter: AdapterKinds): void {
    this.gauge.inc({
      adapter,
    });
  }

  /** will increment only adapters with a specific label  */
  public incByMetricLabel(metric: string): void {
    this.gauge.inc({
      metric,
    });
  }

  /** will increment using different delta */
  public incWithDelta(): void {
    this.gauge.inc({
      delta: 2,
    });
  }

  /** will increment using tags */
  public incWithDeltaAndTags(): void {
    this.gauge.inc({
      tags: {tag: 'gauge'},
    });
  }

  /** will increment using decorator */
  @EventIncrement()
  public async incWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  /** will set only prometheus adapters */
  public setByAdapter(adapter: AdapterKinds): void {
    this.gauge.set({
      delta: 1,
      adapter,
    });
  }

  /** will set only adapters with a specific label  */
  public setByMetricLabel(metric: string): void {
    this.gauge.set({
      delta: 1,
      metric,
    });
  }

  /** will set using tags */
  public setWithTags(): void {
    this.gauge.set({
      delta: 1,
      tags: {tag: 'gauge'},
    });
  }

  /** will increment all adapters */
  public async timeAllAdapters(): Promise<void> {
    const end = this.gauge.startTimer();

    await new Promise((resolve) =>
      setTimeout(() => {
        end();
        resolve(0);
      }, 200),
    );
  }

  /** will time only prometheus adapters */
  public async timeByAdapter(adapter: AdapterKinds): Promise<void> {
    const end = this.gauge.startTimer({
      adapter,
    });

    await new Promise((resolve) =>
      setTimeout(() => {
        end();
        resolve(0);
      }, 200),
    );
  }

  /** will time only adapters with a specific label  */
  public async timeByMetricLabel(metric: string): Promise<void> {
    const end = this.gauge.startTimer({
      metric,
    });

    await new Promise((resolve) =>
      setTimeout(() => {
        end();
        resolve(0);
      }, 200),
    );
  }

  /** will time using tags */
  public async timeWithTags(): Promise<void> {
    const end = this.gauge.startTimer({
      tags: {tag: 'gauge'},
    });

    await new Promise((resolve) =>
      setTimeout(() => {
        end();
        resolve(0);
      }, 200),
    );
  }

  /** will time using tags */
  public async timeWithEndTags(): Promise<void> {
    const end = this.gauge.startTimer();

    await new Promise((resolve) =>
      setTimeout(() => {
        end({
          tags: {tag: 'gauge'},
        });
        resolve(0);
      }, 200),
    );
  }

  // TODO: add time decorator
  // /** will decrement using decorator */
  // @EventIncrement()
  // public async decWithDecorator(): Promise<void> {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  // }
}
/* eslint-enable @typescript-eslint/no-empty-function */
