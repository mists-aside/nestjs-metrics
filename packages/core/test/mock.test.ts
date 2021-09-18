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
  MockHistogram,
  MockSummary,
  ObservableOptions,
  TimerOptions,
} from '../src';
import {mlm} from '../src/mock/literals';

chai.use(sinonChai);

const getInstanceToReturnObject = '.getInstance() to return an object';

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

    it(getInstanceToReturnObject, function () {
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
    let obsOptions: CountableOptions | undefined;
    let timerOptions: TimerOptions | undefined;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      gauge = MockGauge.getInstance();
      sandbox.spy(gauge.logger, 'debug');
      obsOptions = {
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

      obsOptions = undefined;
      timerOptions = undefined;
    });

    it(getInstanceToReturnObject, function () {
      expect(gauge).to.be.an('object');
      expect(gauge instanceof MockGauge).to.be.true;
    });

    it(`.dec(${JSON.stringify(obsOptions)}) to log the right message`, function () {
      gauge?.dec(obsOptions as CountableOptions);

      expect(gauge?.logger.debug).to.have.been.called;
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`Gauge.dec${obsOptions}`);
    });

    it(`.inc(${JSON.stringify(obsOptions)}) to log the right message`, function () {
      gauge?.inc(obsOptions as CountableOptions);

      expect(gauge?.logger.debug).to.have.been.called;
      expect(gauge?.logger.debug).to.have.been.calledWith(mlm`Gauge.inc${obsOptions}`);
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

  describe('Histogram', function () {
    let histogram: MockHistogram | undefined;
    let sandbox: sinon.SinonSandbox | undefined;
    let obsOptions: ObservableOptions | undefined;
    let timerOptions: TimerOptions | undefined;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      histogram = MockHistogram.getInstance();
      sandbox.spy(histogram.logger, 'debug');
      obsOptions = {
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

      histogram = undefined;

      obsOptions = undefined;
      timerOptions = undefined;
    });

    it(getInstanceToReturnObject, function () {
      expect(histogram).to.be.an('object');
      expect(histogram instanceof MockHistogram).to.be.true;
    });

    it(`.observe(${JSON.stringify(obsOptions)}) to log the right message`, function () {
      histogram?.observe(obsOptions as ObservableOptions);

      expect(histogram?.logger.debug).to.have.been.called;
      expect(histogram?.logger.debug).to.have.been.calledWith(mlm`Histogram.observe${obsOptions}`);
    });

    it(`.startTimer(${JSON.stringify(timerOptions)}) to log the right message`, function () {
      const endTimer = histogram?.startTimer(timerOptions);

      expect(histogram?.logger.debug).to.have.been.called;
      expect(histogram?.logger.debug).to.have.been.calledWith(mlm`Histogram.startTimer${timerOptions}`);

      expect(typeof endTimer).to.be.equal('function');
      // you need to cast the method here, not because method may be undefined, but because
      // it sees gauge as possible undefined which determines endTimer to possible be undefined
      (endTimer as EndTimerMethod)(timerOptions);
      expect(histogram?.logger.debug).to.have.been.calledWith(mlm`endTimer${timerOptions}`);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  describe('Summary', function () {
    let summary: MockSummary | undefined;
    let sandbox: sinon.SinonSandbox | undefined;
    let obsOptions: ObservableOptions | undefined;
    let timerOptions: TimerOptions | undefined;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      summary = MockSummary.getInstance();
      sandbox.spy(summary.logger, 'debug');
      obsOptions = {
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

      summary = undefined;

      obsOptions = undefined;
      timerOptions = undefined;
    });

    it(getInstanceToReturnObject, function () {
      expect(summary).to.be.an('object');
      expect(summary instanceof MockSummary).to.be.true;
    });

    it(`.observe(${JSON.stringify(obsOptions)}) to log the right message`, function () {
      summary?.observe(obsOptions as ObservableOptions);

      expect(summary?.logger.debug).to.have.been.called;
      expect(summary?.logger.debug).to.have.been.calledWith(mlm`Summary.observe${obsOptions}`);
    });

    it(`.startTimer(${JSON.stringify(timerOptions)}) to log the right message`, function () {
      const endTimer = summary?.startTimer(timerOptions);

      expect(summary?.logger.debug).to.have.been.called;
      expect(summary?.logger.debug).to.have.been.calledWith(mlm`Summary.startTimer${timerOptions}`);

      expect(typeof endTimer).to.be.equal('function');
      // you need to cast the method here, not because method may be undefined, but because
      // it sees gauge as possible undefined which determines endTimer to possible be undefined
      (endTimer as EndTimerMethod)(timerOptions);
      expect(summary?.logger.debug).to.have.been.calledWith(mlm`endTimer${timerOptions}`);
    });

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
