import {Adapter} from './interfaces';

export interface AdapterItem {
  metric: string;
  adapter: Adapter;
}

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private cAdapters: AdapterItem[] = [];

  get adapters(): AdapterItem[] {
    return this.cAdapters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addAdapter(name: string, adapter: Adapter): void {
    this.cAdapters[name] = adapter;
  }

  addAdapters(adapters: AdapterItem[]): void {
    this.cAdapters = [...this.cAdapters, ...adapters];
  }

  clear(): void {
    this.cAdapters = [];
  }
}
