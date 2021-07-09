import {Adapter, AdapterFilter} from './adapter';

/**
 * @ignore
 */
export class Config {
  private static instance: Config;

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private cAdapters: Adapter[] = [];

  get adapters(): Adapter[] {
    return this.getAdapters();
  }

  addAdapter(adapter: Adapter): void {
    this.cAdapters.push(adapter);
  }

  addAdapters(adapters: Adapter[]): void {
    this.cAdapters = [...this.cAdapters, ...adapters];
  }

  clear(): void {
    this.cAdapters = [];
  }

  getAdapters(filter?: AdapterFilter): Adapter[] {
    filter = filter || (() => true);
    return this.cAdapters.filter(filter);
  }
}
