/* eslint-disable max-lines-per-function */
import {CountableOptions, EndTimerMethod, ObservableOptions, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {PrometheusGauge} from '../src';
import {MockPrometheusGauge, mockPromGaugeLogger} from '../src/mock';

chai.use(sinonChai);

describe('./gauge', function () {
  let gauge: MockPrometheusGauge | undefined;
  let sandbox: sinon.SinonSandbox | undefined;
  let setOptions: ObservableOptions;
  let incOptions: CountableOptions;
  let timerOptions: TimerOptions;
  let endTimerOptions: TimerOptions;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    sandbox.spy(mockPromGaugeLogger, 'debug');

    gauge = new MockPrometheusGauge();

    incOptions = {
      labels: ['prom_gauge_1', 'prom_gauge_2'],
    };
    setOptions = {
      labels: ['prom_gauge_1', 'prom_gauge_2'],
      delta: 1,
    };
    timerOptions = {
      labels: ['prom_gauge_1', 'prom_gauge_2'],
      tags: {tag1: 'tag1', tag2: 'tag2'},
    };
    endTimerOptions = {
      labels: ['prom_gauge_1', 'prom_gauge_2'],
      tags: {tag1: 'tag1', tag2: 'tag2', tag3: 'tag3'},
    };
  });

  afterEach(function () {
    sandbox?.restore();
    sandbox = undefined;

    gauge = undefined;
  });

  it('.getInstance(...) to return an object', function () {
    expect(gauge).to.be.an('object');
    expect(gauge instanceof PrometheusGauge).to.be.true;
  });

  it(`.dec({labels:[...]}) to log the right message`, function () {
    gauge?.dec({
      ...incOptions,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(mlm`MockPromGauge.dec${{name: 'prom_gauge_1'}}`);
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(mlm`MockPromGauge.dec${{name: 'prom_gauge_2'}}`);
  });

  it(`.dec({labels:[...], delta}) to log the right message`, function () {
    gauge?.dec({
      ...incOptions,
      delta: 2,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.dec${{name: 'prom_gauge_1', value: 2}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.dec${{name: 'prom_gauge_2', value: 2}}`,
    );
  });

  it(`.dec({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.dec({
      ...incOptions,
      tags,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.dec${{name: 'prom_gauge_1', labels: tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.dec${{name: 'prom_gauge_2', labels: tags}}`,
    );
  });

  it(`.inc({labels:[...]}) to log the right message`, function () {
    gauge?.inc({
      ...incOptions,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(mlm`MockPromGauge.inc${{name: 'prom_gauge_1'}}`);
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(mlm`MockPromGauge.inc${{name: 'prom_gauge_2'}}`);
  });

  it(`.inc({labels:[...], delta}) to log the right message`, function () {
    gauge?.inc({
      ...incOptions,
      delta: 2,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.inc${{name: 'prom_gauge_1', value: 2}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.inc${{name: 'prom_gauge_2', value: 2}}`,
    );
  });

  it(`.inc({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.inc({
      ...incOptions,
      tags,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.inc${{name: 'prom_gauge_1', labels: tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.inc${{name: 'prom_gauge_2', labels: tags}}`,
    );
  });

  it(`.set({labels:[...], delta}) to log the right message`, function () {
    gauge?.set({
      ...setOptions,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.set${{name: 'prom_gauge_1', value: 1}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.set${{name: 'prom_gauge_2', value: 1}}`,
    );
  });

  it(`.set({labels:[...], tags, delta}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.set({
      ...setOptions,
      tags,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.set${{name: 'prom_gauge_1', labels: tags, value: 1}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.set${{name: 'prom_gauge_2', labels: tags, value: 1}}`,
    );
  });

  it(`.startTimer({labels:[...], tags:{...}}).endTimer() to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.startTimer${{name: 'prom_gauge_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.startTimer${{name: 'prom_gauge_2', labels: timerOptions.tags}}`,
    );

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)();

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.endTimer${{name: 'prom_gauge_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.endTimer${{name: 'prom_gauge_2', labels: timerOptions.tags}}`,
    );
  });

  it(`.startTimer({labels:[...]}).endTimer({...}) to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(mockPromGaugeLogger.debug).to.have.been.called;

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.startTimer${{name: 'prom_gauge_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.startTimer${{name: 'prom_gauge_2', labels: timerOptions.tags}}`,
    );

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)(endTimerOptions);

    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.endTimer${{name: 'prom_gauge_1', labels: endTimerOptions.tags}}`,
    );
    expect(mockPromGaugeLogger.debug).to.have.been.calledWith(
      mlm`MockPromGauge.endTimer${{name: 'prom_gauge_2', labels: endTimerOptions.tags}}`,
    );
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
