import { Config, MetricsModule } from '@mists/nestjs-metrics';
import { PrometheusAdapter } from '@mists/nestjs-metrics-prometheus';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CounterController } from './counter/counter.controller';
import { GaugeController } from './gauge/gauge.controller';
import { HistogramController } from './historigram/histogram.controller';
import { PrometheusController } from './prometheus/prometheus.controller';
import { SummaryController } from './summary/summary.controller';
import { UrlLoggerMiddleware } from './url-logger.middleware';

@Module({
  imports: [
    MetricsModule.register({
      adapters: [
        new PrometheusAdapter('prometheus'),
        // new StatsdAdapter('statsd', null),
      ],
      // instanceLabel: 'demo',
    }),
  ],
  controllers: [
    AppController,
    CounterController,
    GaugeController,
    HistogramController,
    SummaryController,
    PrometheusController,
  ],
  providers: [AppService, Config],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UrlLoggerMiddleware).forRoutes('');
  }
}
