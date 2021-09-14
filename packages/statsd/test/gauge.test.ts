/* eslint-disable max-lines-per-function */
import {CountableOptions, EndTimerMethod, ObservableOptions, TimerOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {StatsdGauge} from '../src';
import {MockStatsdClient} from '../src/mock';

chai.use(sinonChai);

describe('./gauge', function () {
  let client: MockStatsdClient | undefined;
  let gauge: StatsdGauge | undefined;
  let sandbox: sinon.SinonSandbox | undefined;
  let setOptions: ObservableOptions;
  let incOptions: CountableOptions;
  let timerOptions: TimerOptions;
  let endTimerOptions: TimerOptions;

  beforeEach(function () {
    client = new MockStatsdClient();

    sandbox = sinon.createSandbox();
    sandbox.spy(client, 'gauge');
    sandbox.spy(client, 'gaugeDelta');
    sandbox.spy(client, 'timing');

    gauge = new StatsdGauge(client);

    sandbox.spy(gauge, 'startTimer');

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
    expect(gauge instanceof StatsdGauge).to.be.true;
  });

  it(`.dec({labels:[...]}) to log the right message`, function () {
    gauge?.dec({
      ...incOptions,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -1);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -1);
  });

  it(`.dec({labels:[...], delta}) to log the right message`, function () {
    gauge?.dec({
      ...incOptions,
      delta: 2,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -2);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -2);
  });

  it(`.dec({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.dec({
      ...incOptions,
      tags,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -1, tags);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', -1, tags);
  });

  it(`.inc({labels:[...]}) to log the right message`, function () {
    gauge?.inc({
      ...incOptions,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 1);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 1);
  });

  it(`.inc({labels:[...], delta}) to log the right message`, function () {
    gauge?.inc({
      ...incOptions,
      delta: 2,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 2);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 2);
  });

  it(`.inc({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.inc({
      ...incOptions,
      tags,
    });

    expect(client?.gaugeDelta).to.have.been.called;

    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 1, tags);
    expect(client?.gaugeDelta).to.have.been.calledWith('prom_gauge_1', 1, tags);
  });

  it(`.set({labels:[...], delta}) to log the right message`, function () {
    gauge?.set({
      ...setOptions,
    });

    expect(client?.gauge).to.have.been.called;

    expect(client?.gauge).to.have.been.calledWith('prom_gauge_1', 1);
    expect(client?.gauge).to.have.been.calledWith('prom_gauge_1', 1);
  });

  it(`.set({labels:[...], tags, delta}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    gauge?.set({
      ...setOptions,
      tags,
    });

    expect(client?.gauge).to.have.been.called;

    expect(client?.gauge).to.have.been.calledWith('prom_gauge_1', 1, tags);
    expect(client?.gauge).to.have.been.calledWith('prom_gauge_1', 1, tags);
  });

  it(`.startTimer({labels:[...], tags:{...}}).endTimer() to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(gauge?.startTimer).to.have.been.called;

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)();

    expect(client?.timing).to.have.been.called;

    expect(client?.timing).to.have.been.calledWith('prom_gauge_1', sinon.match.any, timerOptions.tags);
    expect(client?.timing).to.have.been.calledWith('prom_gauge_2', sinon.match.any, timerOptions.tags);
  });

  it(`.startTimer({labels:[...]}).endTimer({...}) to log the right message`, function () {
    const endTimer = gauge?.startTimer({
      ...timerOptions,
    });

    expect(gauge?.startTimer).to.have.been.called;

    expect(endTimer).to.be.a('function');

    (endTimer as EndTimerMethod)(endTimerOptions);

    expect(client?.timing).to.have.been.called;

    expect(client?.timing).to.have.been.calledWith('prom_gauge_1', sinon.match.any, endTimerOptions.tags);
    expect(client?.timing).to.have.been.calledWith('prom_gauge_2', sinon.match.any, endTimerOptions.tags);
  });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
