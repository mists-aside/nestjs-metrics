/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function */
import {Metrics} from '../enum';

/**
 * @ignore
 */
export const DummyCounter = {
  inc: (): void => {},
};

/**
 * @ignore
 */
export const DummyTimer = {
  startTimer: (): (() => void) => () => {},
};

/**
 * @ignore
 */
export const DummyGauge = {
  ...DummyCounter,
  dec: (): void => {},
  set: (): void => {},
  ...DummyTimer,
};

/**
 * @ignore
 */
export const DummyHistogram = {
  observe: (): void => {},
  ...DummyTimer,
};

/**
 * @ignore
 */
export const DummySummary = {
  ...DummyHistogram,
};

/**
 * @ignore
 */
export const metrics = {
  [Metrics.Counter]: DummyCounter,
  [Metrics.Gauge]: DummyGauge,
  [Metrics.Histogram]: DummyHistogram,
  [Metrics.Summary]: DummySummary,
};
