import {Adapter, AdapterFilter} from './interfaces';

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

  private cInstanceLabel = '';

  get adapters(): Adapter[] {
    return this.getAdapters();
  }

  get instanceLabel(): string {
    return this.cInstanceLabel;
  }

  set instanceLabel(label: string) {
    this.cInstanceLabel = label;
  }

  addAdapter(adapter: Adapter): void {
    this.cAdapters.push(adapter);
  }

  addAdapters(adapters: Adapter[]): void {
    this.cAdapters = [...this.cAdapters, ...adapters];
  }

  clear(): void {
    this.cAdapters = [];
    this.cInstanceLabel = '';
  }

  getAdapters(filter?: AdapterFilter): Adapter[] {
    filter = filter || (() => true);
    return this.cAdapters.filter(filter);
  }
}
