import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CounterController } from './counter/counter.controller';
import { GaugeController } from './gauge/gauge.controller';
import { HistorigramController } from './historigram/historigram.controller';
import { SummaryController } from './summary/summary.controller';
import { MetricsModule } from '@mists/nestjs-metrics';

@Module({
  imports: [
    MetricsModule.register({
      adapters: [],
    }),
  ],
  controllers: [
    AppController,
    CounterController,
    GaugeController,
    HistorigramController,
    SummaryController,
  ],
  providers: [AppService],
})
export class AppModule {}
