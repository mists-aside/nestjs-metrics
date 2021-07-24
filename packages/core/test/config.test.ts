/* eslint-disable max-lines-per-function */
import {expect} from 'chai';
import {describe, it} from 'mocha';

import {Adapter, Config, MockAdapter} from '../src';

describe('Config', function () {
  let config: Config;

  beforeEach(function () {
    config = Config.getInstance();

    config.clear();
  });

  it('.adapters to be an Array', function () {
    expect(config.adapters).to.be.an('array');
  });

  it('.addAdapter() to add a metrics adapter to the list', function () {
    config.addAdapter(new MockAdapter('mock'));

    expect(config.adapters.length).to.equal(1);
    expect(config.adapters[0].adapterLabel).to.equal('mock');
  });

  it('.addAdapters() to add multiple metric adapters to the list', function () {
    config.addAdapters([new MockAdapter('mock1'), new MockAdapter('mock2')]);

    expect(config.adapters.length).to.equal(2);
    expect(config.adapters[0].adapterLabel).to.equal('mock1');
  });

  it('.clear() to clear the list of adapters', function () {
    config.addAdapters([new MockAdapter('mock1'), new MockAdapter('mock2')]);

    expect(config.adapters.length).to.equal(2);

    config.clear();
    expect(config.adapters.length).to.equal(0);
  });

  it('.getAdapters() to obtain the proper list of adapters', function () {
    config.addAdapters([new MockAdapter('mock1'), new MockAdapter('mock2')]);

    expect(config.getAdapters((adapter: Adapter) => adapter.adapterLabel === 'mock1').length).to.equal(1);
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
