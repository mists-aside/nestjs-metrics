/* eslint-disable max-lines-per-function */
import {CountableOptions, MetricOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {PrometheusCounter} from '../src';
import {MockPrometheusCounter, mockPromCounterLogger} from '../src/mock';

chai.use(sinonChai);

describe('./counter', function () {
  let counter: MockPrometheusCounter | undefined;
  let sandbox: sinon.SinonSandbox | undefined;
  let incOptions: CountableOptions;
  let resetOptions: MetricOptions | undefined;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    sandbox.spy(mockPromCounterLogger, 'debug');

    counter = new MockPrometheusCounter();

    incOptions = {
      labels: ['prom_metric_1', 'prom_metric_2'],
    };
    resetOptions = {
      labels: ['prom_metric_1', 'prom_metric_2'],
    };
  });

  afterEach(function () {
    sandbox?.restore();
    sandbox = undefined;

    counter = undefined;
  });

  it('.getInstance(...) to return an object', function () {
    expect(counter).to.be.an('object');
    expect(counter instanceof PrometheusCounter).to.be.true;
  });

  it(`.inc({labels:[...]}) to log the right message`, function () {
    counter?.inc({
      ...incOptions,
    });

    expect(mockPromCounterLogger.debug).to.have.been.called;

    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_1', labels: {}}}`,
    );
    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_2', labels: {}}}`,
    );
  });

  it(`.inc({labels:[...], delta}) to log the right message`, function () {
    counter?.inc({
      ...incOptions,
      delta: 2,
    });

    expect(mockPromCounterLogger.debug).to.have.been.called;

    const others = {
      labels: {},
      value: 2,
    };

    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_1', ...others}}`,
    );
    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_2', ...others}}`,
    );
  });

  it(`.inc({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    counter?.inc({
      ...incOptions,
      tags,
    });

    expect(mockPromCounterLogger.debug).to.have.been.called;

    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_1', labels: tags}}`,
    );
    expect(mockPromCounterLogger.debug).to.have.been.calledWith(
      mlm`MockPromCounter.inc${{name: 'prom_metric_2', labels: tags}}`,
    );
  });

  it(`.reset(${JSON.stringify(resetOptions)}) to log the right message`, function () {
    counter?.reset(resetOptions as MetricOptions);

    expect(mockPromCounterLogger.debug).to.have.been.called;

    expect(mockPromCounterLogger.debug).to.have.been.calledWith(mlm`MockPromCounter.reset${{name: 'prom_metric_1'}}`);
    expect(mockPromCounterLogger.debug).to.have.been.calledWith(mlm`MockPromCounter.reset${{name: 'prom_metric_2'}}`);
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
