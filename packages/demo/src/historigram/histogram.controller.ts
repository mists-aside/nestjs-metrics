import { Controller, Get, Logger, Param } from '@nestjs/common';
import {
  Config,
  Histogram,
  Observe,
  Timer,
  TimerMetricType,
} from '@mists/nestjs-metrics';

const logger = new Logger('HistogramController');

@Controller('histogram')
export class HistogramController {
  constructor(protected config: Config) {}

  protected getHistogramsByName(name: string): Histogram[] {
    return this.config.adapters
      .filter((adapter) => adapter.adapterLabel === name)
      .map((adapter) => adapter.getHistogram());
  }

  @Get('observe')
  @Observe({
    logger,
    options: {
      labels: ['metric_gauge_inc_1'],
      delta: 100,
    },
  })
  set() {
    return 1;
  }

  @Get('timer')
  @Timer({
    logger,
    metricType: TimerMetricType.Histogram,
    options: {
      labels: ['metric_gauge_timer_1'],
    },
  })
  async timer(): Promise<number> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(1), Math.random() * 5000),
    );
  }

  @Get('timer/:time')
  async timerByTime(@Param('time') time: number): Promise<number> {
    const timers = this.getHistogramsByName('metric_gauge_timer_2').map(
      (h: Histogram) =>
        h.startTimer({
          labels: ['metric_gauge_timer_2'],
        }),
    );
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(1);
        timers.forEach((timer) => timer());
      }, time),
    );
  }
}
