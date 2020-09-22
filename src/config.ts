import {StatsTypes} from './options';
import {PrometheusOptions} from './prometheus/options';
import {StatsdOptions} from './statsd/options';

export class Config {
  private static instance: Config;

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // private constructor() {}

  private cTypes: StatsTypes[] = [];
  private cPrometheus?: PrometheusOptions;
  private cStatsd?: StatsdOptions;

  public get prometheus(): PrometheusOptions | undefined {
    return this.cPrometheus;
  }

  public setPrometheusOptions(options: PrometheusOptions): void {
    this.cPrometheus = options;
  }

  public setStatsdOptions(options: StatsdOptions): void {
    this.cStatsd = options;
  }

  public setTypes(types: StatsTypes[]): void {
    this.cTypes = types;
  }

  public get statsd(): StatsdOptions {
    return this.cStatsd;
  }

  public get types(): StatsTypes[] {
    return this.cTypes;
  }
}
