import {v4 as uuid} from 'uuid';

export class MetadataLabels {
  private static instance: MetadataLabels;

  private pStatsd: string;
  private pPrometheus: string;

  public static getInstance(): MetadataLabels {
    if (!MetadataLabels.instance) {
      MetadataLabels.instance = new MetadataLabels();
    }
    return MetadataLabels.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this.reset();
  }

  public reset(): void {
    this.pStatsd = uuid();
  }

  get statsd(): string {
    return this.pStatsd;
  }

  get prometheus(): string {
    return this.pPrometheus;
  }
}
