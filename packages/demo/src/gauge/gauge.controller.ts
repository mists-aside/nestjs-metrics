import { Controller, Get, Logger } from '@nestjs/common';
import { Dec, Inc, IncMetricType, Set, Timer } from '@mists/nestjs-metrics';

const logger = new Logger('GaugeController');

@Controller('gauge')
export class GaugeController {
  @Get('dec')
  @Dec({
    logger,
    options: {
      labels: ['metric_gauge_inc_1'],
    },
  })
  dec() {
    return 1;
  }

  @Get('inc')
  @Inc({
    logger,
    options: {
      labels: ['metric_gauge_inc_1'],
    },
    metricType: IncMetricType.GAUGE,
  })
  inc() {
    return 1;
  }

  @Get('set')
  @Set({
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
