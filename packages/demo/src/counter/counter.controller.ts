import { Controller, Get, Logger } from '@nestjs/common';
import { Inc } from '@mists/nestjs-metrics';

const logger = new Logger('CounterController');

@Controller('counter')
export class CounterController {
  @Get('inc')
  @Inc({
    logger,
    options: {
      labels: ['metric_count_1'],
    },
  })
  inc(): number {
    return 1;
  }
}
