/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */
import {Metrics} from '../enum';

export const DummyCounter = {
  inc: (): void => {},
};

export const DummyTimer = {
  startTimer: (): (() => void) => () => {},
};

export const DummyGauge = {
  ...DummyCounter,
  dec: (): void => {},
  set: (): void => {},
  ...DummyTimer,
};

export const DummyHistogram = {
  observe: (): void => {},
  ...DummyTimer,
};

export const DummySummary = {
  ...DummyHistogram,
};

export const metrics = {
  [Metrics.Counter]: DummyCounter,
  [Metrics.Gauge]: DummyGauge,
  [Metrics.Histogram]: DummyHistogram,
  [Metrics.Summary]: DummySummary,
};
