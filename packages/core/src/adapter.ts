export interface Tags {
  [key: string]: string | number;
}

export interface TimerMethod {
  (tags?: Tags): void;
}

export interface Counter {
  inc(delta?: number, label?: string, tags?: Tags): void;
}

interface Timer {
  startTimer(label?: string, tags?: Tags): TimerMethod;
}

export interface Gauge extends Counter, Timer {
  set(value: number, label?: string, tags?: Tags): void;
  dec(delta?: number, label?: string, tags?: Tags): void;
}

export interface Histogram extends Timer {
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}

export interface Summary extends Timer {
  observe(value: number, label?: string, tags?: Tags): void;
  reset(label?: string, tags?: Tags): void;
}
