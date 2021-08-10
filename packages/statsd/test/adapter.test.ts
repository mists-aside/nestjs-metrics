/* eslint-disable mocha/no-mocha-arrows */
import * as chai from 'chai';
import {describe, it} from 'mocha';

import {StatsdAdapter, StatsdCounter} from '../src';
import {MockStatsdClient} from '../src/mock';

// chai.use(sinonChai);
const expect = chai.expect;

// eslint-disable-next-line mocha/no-skipped-tests,mocha/no-mocha-arrows
describe('adapter', function () {
  let adapter: StatsdAdapter | null = null;

  beforeEach(function () {
    adapter = new StatsdAdapter('statsd', new MockStatsdClient({}));
  });

  afterEach(function () {
    adapter = null;
  });

  it('new StatsdAdapter() to return an object', function () {
    expect(adapter).to.be.an('object');
  });

  it('StatsdAdapter.getCoutner() to return an object', function () {
    expect(adapter?.getCounter()).to.be.an('object');
    expect(adapter?.getCounter() instanceof StatsdCounter).to.be.true;
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
