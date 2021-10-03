import { Controller, Get, Logger } from '@nestjs/common';
import { Observe, Timer, TimerMetricType } from '@mists/nestjs-metrics';

const logger = new Logger('HistogramController');

@Controller('histogram')
export class HistogramController {
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
      labels: ['metric_gauge_inc_1'],
    },
  })
  async timer(): Promise<number> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(1), Math.random() * 5000),
    );
  }
}
