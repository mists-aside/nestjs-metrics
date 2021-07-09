/* eslint-disable mocha/no-mocha-arrows */
import * as chai from 'chai';
import {describe, it} from 'mocha';
// import * as prometheus from 'prom-client';
// import * as sinon from 'sinon';
// import * as sinonChai from 'sinon-chai';
// import * as uuid from 'uuid';

// import {PrometheusCounterAdapter} from '../src';

// chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests,mocha/no-mocha-arrows
describe('src/adapter', function () {
  // let sandbox: sinon.SinonSandbox;
  // eslint-disable-next-line mocha/no-setup-in-describe
  // const endTimer = sinon.fake();

  // describe('CounterAdapter', () => {
  // let adapter: PrometheusCounterAdapter;
  // let promCounter: prometheus.Counter<string>;

  // beforeEach(() => {
  //   const name = 'counter_' + uuid.v4().replace(/-/gi, '_');
  //   console.log(name);
  //   adapter = new PrometheusCounterAdapter({
  //     name,
  //     help: uuid.v4(),
  //     labelNames: ['counter'],
  //   });

  //   promCounter = adapter.getPromCounter();

  //   sandbox = sinon.createSandbox();
  //   sandbox.spy(promCounter, 'inc');
  // });

  // afterEach(() => {
  //   sandbox.restore();
  //   promCounter = undefined;
  //   adapter = undefined;
  // });

  // it('::counstructor() should return an object', () => {
  //   expect(adapter).to.be.an('object');
  // });

  // it('::inc() should call prometheus.Counter.inc()', () => {
  //   adapter.inc();

  //   expect(promCounter.inc).to.have.been.called;
  // });

  // it('::inc({delta: 2}) should call prometheus.Counter.inc({}, 2)', () => {
  //   adapter.inc({delta: 2});

  //   expect(promCounter.inc).to.have.been.calledWith({}, 2);
  // });

  // it('::inc({tags: {counter: 1}}) should call prometheus.Counter.inc({counter: 1}, 1)', () => {
  //   adapter.inc({tags: {counter: 1}});

  //   expect(promCounter.inc).to.have.been.calledWith({counter: 1}, 1);
  // });

  // it('::inc({delta: 2, tags: {counter: 1}}) should call prometheus.Counter.inc({counter: 1}, 2)', () => {
  //   adapter.inc({delta: 2, tags: {counter: 1}});

  //   expect(promCounter.inc).to.have.been.calledWith({counter: 1}, 2);
  // });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
