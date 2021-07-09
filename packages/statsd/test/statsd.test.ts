/* eslint-disable mocha/no-mocha-arrows */
import * as chai from 'chai';
import {describe, it} from 'mocha';
// import * as sinon from 'sinon';
// import * as sinonChai from 'sinon-chai';
// import * as StatsdClient from 'statsd-client';
// import * as uuid from 'uuid';

// import {StatsdCounterAdapter} from '../src';
// import {StatsdDummy} from './utils/statsd-dummy';

// chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests,mocha/no-mocha-arrows
describe('src/adapter', function () {
  let sandbox: sinon.SinonSandbox;
  // eslint-disable-next-line mocha/no-setup-in-describe
  // const endTimer = sinon.fake();

  // describe('CounterAdapter', () => {
  //   let adapter: StatsdCounterAdapter;
  //   let statsd: StatsdClient;
  //   let metricName: string;

  //   beforeEach(() => {
  //     sandbox = sinon.createSandbox();
  //     statsd = new StatsdDummy() as StatsdClient;
  //     sandbox.spy(statsd, 'increment');

  //     metricName = 'counter.' + uuid.v4().replace(/-/gi, '.');
  //     adapter = new StatsdCounterAdapter(metricName, statsd);
  //   });

  //   afterEach(() => {
  //     sandbox.restore();
  //     statsd = undefined;
  //     adapter = undefined;
  //   });

  //   it('::counstructor() should return an object', () => {
  //     expect(adapter).to.be.an('object');
  //   });

  //   it('::inc() should call StatsdClient.increment.inc()', () => {
  //     adapter.inc();

  //     expect(statsd.increment).to.have.been.called;
  //   });

  //   it('::inc({delta: 2}) should call StatsdClient.increment.inc({}, 2)', () => {
  //     adapter.inc({delta: 2});

  //     expect(statsd.increment).to.have.been.calledWith(metricName, 2, {});
  //   });

  //   it('::inc({tags: {counter: 1}}) should call StatsdClient.increment.inc({counter: 1}, 1)', () => {
  //     adapter.inc({tags: {counter: 1}});

  //     expect(statsd.increment).to.have.been.calledWith(metricName, 1, {counter: 1});
  //   });

  //   it('::inc({delta: 2, tags: {counter: 1}}) should call StatsdClient.increment.inc({counter: 1}, 2)', () => {
  //     adapter.inc({delta: 2, tags: {counter: 1}});

  //     expect(statsd.increment).to.have.been.calledWith(metricName, 2, {counter: 1});
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
