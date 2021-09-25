import { Controller, Get } from '@nestjs/common';
import { Inc, IncMetricType } from '@mists/nestjs-metrics';

@Controller('gauge')
export class GaugeController {
  @Inc(
    {
      labels: ['metric_gauge_inc_1'],
    },
    [],
    IncMetricType.GAUGE,
  )
  @Get('inc')
  inc() {
    return 1;
  }
}
