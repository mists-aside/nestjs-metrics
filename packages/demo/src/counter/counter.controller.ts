import { Controller, Get } from '@nestjs/common';
import { Inc } from '@mists/nestjs-metrics';

@Controller('counter')
export class CounterController {
  @Inc({
    labels: ['metric_count_1'],
  })
  @Get('inc')
  inc() {
    return 1;
  }
}
