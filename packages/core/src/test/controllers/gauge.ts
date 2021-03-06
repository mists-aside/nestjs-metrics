/* eslint-disable @typescript-eslint/no-empty-function */
import {Controller} from '@nestjs/common';

import {MetricDec, MetricInc, MetricReset, MetricSet, MetricTiming} from '../../decorators';
import {AdapterKinds, EndTimerMethod} from '../../interfaces';
import {GaugeMetric} from '../../metrics';

@Controller()
export class GaugeMetricController {
  constructor(protected gauge: GaugeMetric) {}

  /** will decrement all adapters */
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
  public decByMetricName(metric: string): void {
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
      delta: 2,
      tags: {tag: 'gauge'},
    });
  }

  /** will increment using decorator */
  @MetricDec({adapter: 'prometheus'})
  public async decWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

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
  public incByMetricName(metric: string): void {
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
      delta: 2,
      tags: {tag: 'gauge'},
    });
  }

  /** will increment using decorator */
  @MetricInc({adapter: 'prometheus'}, {metricKind: 'gauge'})
  public async incWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // reset

  /** will reset all adapters */
  public resetAllAdapters(): void {
    this.gauge.reset();
  }

  /** will reset only prometheus adapters */
  public resetByAdapter(adapter: AdapterKinds): void {
    this.gauge.reset({
      adapter,
    });
  }

  /** will reset only adapters with a specific label  */
  public resetByMetricName(metric: string): void {
    this.gauge.reset({
      metric,
    });
  }

  /** will increment using decorator */
  @MetricReset({adapter: 'prometheus'}, {metricKind: 'gauge'})
  public async resetWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  /** will set() for all adapters */
  public setAllAdapters(): void {
    this.gauge.set({
      delta: 1,
    });
  }

  /** will set for specific adapter */
  setByAdapter(adapter: AdapterKinds): void {
    this.gauge.set({
      adapter,
      delta: 1,
    });
  }

  setByMetric(metric: string): void {
    this.gauge.set({
      delta: 1,
      metric,
    });
  }

  setWithTags(): void {
    this.gauge.set({
      delta: 2,
      tags: {tag: 'gauge'},
    });
  }

  @MetricSet({adapter: 'prometheus', delta: 2})
  public async setWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  /** will startTimer() for all adapters */
  public async startTimerAllAdapters(): Promise<EndTimerMethod> {
    const endTimer = this.gauge.startTimer();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() for specific adapter */
  public async startTimerByAdapter(adapter: AdapterKinds): Promise<EndTimerMethod> {
    const endTimer = this.gauge.startTimer({
      adapter,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() for specific metricName */
  public async startTimerByMetric(metric: string): Promise<EndTimerMethod> {
    const endTimer = this.gauge.startTimer({
      metric,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() with tags */
  public async startTimerWithTags(): Promise<EndTimerMethod> {
    const endTimer = this.gauge.startTimer({
      tags: {tag: 'gauge'},
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() with tags */
  public async startTimerWithEndTags(): Promise<EndTimerMethod> {
    const endTimer = this.gauge.startTimer();
    await new Promise((resolve) => setTimeout(resolve, 200));
    endTimer({
      tags: {tag: 'gauge'},
    });
    return endTimer;
  }

  @MetricTiming({adapter: 'prometheus'}, {metricKind: 'gauge'})
  public async startTimerWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
/* eslint-enable @typescript-eslint/no-empty-function */
