/* eslint-disable max-lines-per-function */
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {
  CountableOptions,
  EndTimerMethod,
  MetricOptions,
  MockAdapter,
  MockCounter,
  MockGauge,
  TimerOptions,
} from '../src';
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

  describe('Gauge', function () {
    let gauge: MockGauge | undefined;
    let sandbox: sinon.SinonSandbox | undefined;
    let incOptions: CountableOptions | undefined;
    let timerOptions: TimerOptions | undefined;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      gauge = MockGauge.getInstance();
      sandbox.spy(gauge.logger, 'debug');
      incOptions = {
        labels: ['test'],
        delta: 10,
      };
      timerOptions = {
        labels: ['test'],
        tags: {
          test: 'test',
        },
      };
    });

    afterEach(function () {
      sandbox?.restore();
      sandbox = undefined;

      gauge = undefined;

      incOptions = undefined;
      timerOptions = undefined;
    });

    it('.getInstance() to return an object', function () {
      expect(gauge).to.be.an('object');
      expect(gauge instanceof MockGauge).to.be.true;
    });

    it(`.dec(${JSON.stringify(incOptions)}) to log the right message`, function () {
      gauge?.dec(incOptions as CountableOptions);

      expect(gauge?.logger.debug).to.have.been.called;
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`Gauge.dec${incOptions}`);
    });

    it(`.inc(${JSON.stringify(incOptions)}) to log the right message`, function () {
      gauge?.inc(incOptions as CountableOptions);

      expect(gauge?.logger.debug).to.have.been.called;
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`Gauge.inc${incOptions}`);
    });

    it(`.startTimer(${JSON.stringify(timerOptions)}) to log the right message`, function () {
      const endTimer = gauge?.startTimer(timerOptions);

      expect(gauge?.logger.debug).to.have.been.called;
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`Gauge.startTimer${timerOptions}`);

      expect(typeof endTimer).to.be.equal('function');
      // you need to cast the method here, not because method may be undefined, but because
      // it sees gauge as possible undefined which determines endTimer to possible be undefined
      (endTimer as EndTimerMethod)(timerOptions);
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`endTimer${timerOptions}`);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
