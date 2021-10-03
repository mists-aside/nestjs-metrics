import { Controller, Get, Logger } from '@nestjs/common';
import {
  Observe,
  ObserveMetricType,
  Timer,
  TimerMetricType,
} from '@mists/nestjs-metrics';

const logger = new Logger('SummaryController');

@Controller('summary')
export class SummaryController {
  @Get('observe')
  @Observe({
    logger,
    metricType: ObserveMetricType.Summary,
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
