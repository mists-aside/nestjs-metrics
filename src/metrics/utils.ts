import { CounterConfiguration, GaugeConfiguration } from "prom-client";

export interface CounterOptions {
  prometheus?: Partial<Omit<CounterConfiguration<string>, 'name'>>;
}

export interface GaugeOptions {
  prometheus?: Partial<Omit<GaugeConfiguration<string>, 'name'>>;
}

