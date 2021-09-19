/* eslint-disable max-lines-per-function */
import {CountableOptions, EndTimerMethod, MetricOptions, ObservableOptions, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {PrometheusSummary} from '../src';
import {MockPrometheusSummary, mockPromSummaryLogger} from '../src/mock';

chai.use(sinonChai);

describe('./gauge', function () {
  let gauge: MockPrometheusSummary | undefined;
  let sandbox: sinon.SinonSandbox | undefined;
  let observeOptions: ObservableOptions;
  let resetOptions: MetricOptions | undefined;
  let timerOptions: TimerOptions;
  let endTimerOptions: TimerOptions;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    sandbox.spy(mockPromSummaryLogger, 'debug');

    gauge = new MockPrometheusSummary();

    observeOptions = {
      labels: ['prom_summary_1', 'prom_summary_2'],
      delta: 1,
    };
    resetOptions = {
      labels: ['prom_summary_1', 'prom_summary_2'],
    };
    timerOptions = {
      labels: ['prom_summary_1', 'prom_summary_2'],
      tags: {tag1: 'tag1', tag2: 'tag2'},
    };
    endTimerOptions = {
      labels: ['prom_summary_1', 'prom_summary_2'],
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
    expect(gauge instanceof PrometheusSummary).to.be.true;
  });

  it(`.reset(${JSON.stringify(resetOptions)}) to log the right message`, function () {
    gauge?.reset(resetOptions as MetricOptions);

    expect(mockPromSummaryLogger.debug).to.have.been.called;

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(mlm`MockPromSummary.reset${{name: 'prom_summary_1'}}`);
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(mlm`MockPromSummary.reset${{name: 'prom_summary_2'}}`);
  });

  it(`.observe({labels:[...], delta}) to log the right message`, function () {
    gauge?.observe({
      ...observeOptions,
    });

    expect(mockPromSummaryLogger.debug).to.have.been.called;

    const others = {
      labels: {},
      value: 1,
    };

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.observe${{name: 'prom_summary_1', ...others}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.observe${{name: 'prom_summary_2', ...others}}`,
    );
  });

  it(`.observe({labels:[...], tags, delta}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.observe({
      ...observeOptions,
      tags,
    });

    expect(mockPromSummaryLogger.debug).to.have.been.called;

    const others = {
      labels: tags,
      value: 1,
    };

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.observe${{name: 'prom_summary_1', ...others}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.observe${{name: 'prom_summary_2', ...others}}`,
    );
  });

  it(`.startTimer({labels:[...], tags:{...}}).endTimer() to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(mockPromSummaryLogger.debug).to.have.been.called;

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.startTimer${{name: 'prom_summary_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.startTimer${{name: 'prom_summary_2', labels: timerOptions.tags}}`,
    );

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)();

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.endTimer${{name: 'prom_summary_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.endTimer${{name: 'prom_summary_2', labels: timerOptions.tags}}`,
    );
  });

  it(`.startTimer({labels:[...]}).endTimer({...}) to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(mockPromSummaryLogger.debug).to.have.been.called;

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.startTimer${{name: 'prom_summary_1', labels: timerOptions.tags}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.startTimer${{name: 'prom_summary_2', labels: timerOptions.tags}}`,
    );

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)(endTimerOptions);

    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.endTimer${{name: 'prom_summary_1', labels: endTimerOptions.tags}}`,
    );
    expect(mockPromSummaryLogger.debug).to.have.been.calledWith(
      mlm`MockPromSummary.endTimer${{name: 'prom_summary_2', labels: endTimerOptions.tags}}`,
    );
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
