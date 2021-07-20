/* eslint-disable @typescript-eslint/no-empty-function */
import {Controller} from '@nestjs/common';

import {MetricObserve, MetricReset, MetricTiming} from '../../decorators';
import {AdapterKinds, EndTimerMethod} from '../../interfaces';
import {SummaryMetric} from '../../metrics';

@Controller()
export class SummaryMetricController {
  constructor(protected summary: SummaryMetric) {}

  /** will observe() for all adapters */
  public observeAllAdapters(): void {
    this.summary.observe({
      delta: 1,
    });
  }

  /** will observe for specific adapter */
  observeByAdapter(adapter: AdapterKinds): void {
    this.summary.observe({
      adapter,
      delta: 1,
    });
  }

  observeByMetric(metric: string): void {
    this.summary.observe({
      delta: 1,
      metric,
    });
  }

  observeWithTags(): void {
    this.summary.observe({
      delta: 2,
      tags: {tag: 'summary'},
    });
  }

  @MetricObserve({adapter: 'prometheus', delta: 2}, {metricKind: 'summary'})
  public async observeWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // reset

  /** will reset all adapters */
  public resetAllAdapters(): void {
    this.summary.reset();
  }

  /** will reset only prometheus adapters */
  public resetByAdapter(adapter: AdapterKinds): void {
    this.summary.reset({
      adapter,
    });
  }

  /** will reset only adapters with a specific label  */
  public resetByMetricName(metric: string): void {
    this.summary.reset({
      metric,
    });
  }

  /** will increment using decorator */
  @MetricReset({adapter: 'prometheus'}, {metricKind: 'summary'})
  public async resetWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  /** will startTimer() for all adapters */
  public async startTimerAllAdapters(): Promise<EndTimerMethod> {
    const endTimer = this.summary.startTimer();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() for specific adapter */
  public async startTimerByAdapter(adapter: AdapterKinds): Promise<EndTimerMethod> {
    const endTimer = this.summary.startTimer({
      adapter,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() for specific metricName */
  public async startTimerByMetric(metric: string): Promise<EndTimerMethod> {
    const endTimer = this.summary.startTimer({
      metric,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() with tags */
  public async startTimerWithTags(): Promise<EndTimerMethod> {
    const endTimer = this.summary.startTimer({
      tags: {tag: 'summary'},
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    return endTimer;
  }

  /** will startTimer() with tags */
  public async startTimerWithEndTags(): Promise<EndTimerMethod> {
    const endTimer = this.summary.startTimer();
    await new Promise((resolve) => setTimeout(resolve, 200));
    endTimer({
      tags: {tag: 'summary'},
    });
    return endTimer;
  }

  @MetricTiming({adapter: 'prometheus'}, {metricKind: 'summary'})
  public async startTimerWithDecorator(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
/* eslint-enable @typescript-eslint/no-empty-function */
