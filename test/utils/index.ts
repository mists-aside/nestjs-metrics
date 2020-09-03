import * as sinon from 'sinon';

export * from './harness';
export * from './statsd';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockerizeDummy = (entity: object): {[key: string]: any} => {
  const oldEntity = {
    ...entity,
  };
  Object.getOwnPropertyNames(entity).forEach((item) => {
    entity[item] = sinon.fake();
  });
  return oldEntity;
};
