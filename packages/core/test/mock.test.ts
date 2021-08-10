/* eslint-disable max-lines-per-function */
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {CountableOptions, MetricOptions, MockAdapter, MockCounter} from '../src';
import {mlm} from '../src/mock/literals';

chai.use(sinonChai);

describe('./mock', function () {
  describe('Adapter', function () {
    let adapter: MockAdapter | undefined;

    beforeEach(function () {
      adapter = new MockAdapter('mock-adapter');
    });

    afterEach(function () {
      adapter = undefined;
    });

    it('getCounter() to return instanceof MockCounter', function () {
      const counter = adapter?.getCounter();

      expect(counter).to.be.an('object');
      expect(counter instanceof MockCounter).to.be.true;
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Counter', function () {
    let counter: MockCounter | undefined;
    let sandbox: sinon.SinonSandbox | undefined;
    let incOptions: CountableOptions | undefined;
    let resetOptions: MetricOptions | undefined;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      counter = MockCounter.getInstance();
      sandbox.spy(counter.logger, 'debug');
      incOptions = {
        labels: ['test'],
        delta: 10,
      };
      resetOptions = {
        labels: ['test'],
      };
    });

    afterEach(function () {
      sandbox?.restore();
      sandbox = undefined;

      counter = undefined;

      incOptions = undefined;
      resetOptions = undefined;
    });

    it('.getInstance() to return an object', function () {
      expect(counter).to.be.an('object');
    });

    it(`.inc(${JSON.stringify(incOptions)}) to log the right message`, function () {
      counter?.inc(incOptions as CountableOptions);

      expect(counter?.logger.debug).to.have.been.called;
      expect(counter?.logger.debug).to.have.been.calledWith(mlm`Counter.inc${incOptions}`);
    });

    it(`.reset(${JSON.stringify(resetOptions)}) to log the right message`, function () {
      counter?.reset(resetOptions as MetricOptions);

      expect(counter?.logger.debug).to.have.been.called;
      expect(counter?.logger.debug).to.have.been.calledWith(mlm`Counter.reset${resetOptions}`);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
