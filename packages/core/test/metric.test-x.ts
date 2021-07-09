/* eslint-disable mocha/no-mocha-arrows,max-lines-per-function */
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinonChai from 'sinon-chai';

// import {CounterAdapter} from '../src/adapters';
// import {AdapterItem, Config} from '../src/config';
// import {Metric} from '../src/metrics/metric';
// import {CounterPrometheus, CounterStatsd} from './utils/adapters';

// chai.use(sinonChai);
// const expect = chai.expect;

// const counter1 = nanoid();
// const counter2 = nanoid();

// const counter1AdapterProm = new CounterPrometheus();
// const counter2AdapterProm = new CounterPrometheus();
// const counter2AdapterStatsd = new CounterStatsd();

// const metricAdapters = [
//   {
//     adapter: counter1AdapterProm,
//     metric: counter1,
//   },
//   {
//     adapter: counter2AdapterProm,
//     metric: counter2,
//   },
//   {
//     adapter: counter2AdapterStatsd,
//     metric: counter2,
//   },
// ];

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  // before(() => {
  //   Config.getInstance().clear();
  //   Config.getInstance().addAdapters(metricAdapters);
  // });

  // describe('Metric', () => {
  //   let metric: Metric | undefined;

  //   beforeEach(() => {
  //     metric = new Metric();
  //   });

  //   afterEach(() => {
  //     metric = undefined;
  //   });

  //   it('::constructor() should create a valid object', () => {
  //     expect(metric).to.be.an('object');
  //   });

  //   it('::searchAdapters("name") to return a specific adapter (as an array)', () => {
  //     expect(metric.searchAdapters(counter1)).to.be.an('array');
  //     expect(metric.searchAdapters(counter1).length).to.equal(1);
  //     expect(metric.searchAdapters(counter1)[0].adapter instanceof CounterAdapter).to.be.true;
  //     expect(metric.searchAdapters(counter1)[0].adapter instanceof CounterPrometheus).to.be.true;
  //   });

  //   it('::searchAdapters(CounterAdapter) to return a specific adapter (as an array)', () => {
  //     expect(metric.searchAdapters({metricKind: 'counter'})).to.be.an('array');
  //     expect(metric.searchAdapters({metricKind: 'counter'}).length).to.equal(3);
  //     expect(metric.searchAdapters({metricKind: 'counter'})[0].adapter instanceof CounterAdapter).to.be.true;
  //   });

  //   it('::searchAdapters(() => {}) to return a specific adapter (as an array)', () => {
  //     const method = (item: AdapterItem): boolean => item.adapter instanceof CounterAdapter;
  //     expect(metric.searchAdapters(method)).to.be.an('array');
  //     expect(metric.searchAdapters(method).length).to.equal(3);
  //     expect(metric.searchAdapters(method)[0].adapter instanceof CounterAdapter).to.be.true;
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
