import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CounterController } from './counter/counter.controller';
import { GaugeController } from './gauge/gauge.controller';
import { HistogramController } from './historigram/histogram.controller';
import { SummaryController } from './summary/summary.controller';
import { MetricsModule } from '@mists/nestjs-metrics';
import { UrlLoggerMiddleware } from './url-logger.middleware';
import { MetricsController } from './metrics/metrics.controller';

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
    HistogramController,
    SummaryController,
    MetricsController,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UrlLoggerMiddleware).forRoutes('');
  }
}
