/* eslint-disable max-lines-per-function */
import {CountableOptions} from '@mists/nestjs-metrics';
import {mlm} from '@mists/nestjs-metrics/dist/commonjs/mock/literals';
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {StatsdCounter} from '../src';
import {MockStatsdClient} from '../src/mock';

chai.use(sinonChai);

describe('./counter', function () {
  let client: MockStatsdClient | undefined;
  let counter: StatsdCounter | undefined;
  let sandbox: sinon.SinonSandbox | undefined;
  let incOptions: CountableOptions;

  beforeEach(function () {
    client = new MockStatsdClient();

    sandbox = sinon.createSandbox();
    sandbox.spy(client, 'increment');

    counter = new StatsdCounter(client);

    incOptions = {
      labels: ['statsd_metric_1', 'statsd_metric_2'],
    };
  });

  afterEach(function () {
    sandbox?.restore();
    sandbox = undefined;

    counter = undefined;
    client = undefined;
  });

  it('.getInstance(...) to return an object', function () {
    expect(counter).to.be.an('object');
    expect(counter instanceof StatsdCounter).to.be.true;
  });

  it(`.inc({labels:[...]}) to log the right message`, function () {
    counter?.inc({
      ...incOptions,
    });

    expect(client?.increment).to.have.been.called;
    expect(client?.increment).to.have.been.calledWith('statsd_metric_1');
    expect(client?.increment).to.have.been.calledWith('statsd_metric_2');
  });

  it(`.inc({labels:[...], delta}) to log the right message`, function () {
    counter?.inc({
      ...incOptions,
      delta: 2,
    });

    expect(client?.increment).to.have.been.called;
    expect(client?.increment).to.have.been.calledWith('statsd_metric_1', 2);
    expect(client?.increment).to.have.been.calledWith('statsd_metric_2', 2);
  });

  it(`.inc({labels:[...], tags}) to log the right message`, function () {
    const tags = {
      test: 1,
    };
    counter?.inc({
      ...incOptions,
      tags,
    });

    expect(client?.increment).to.have.been.called;
    expect(client?.increment).to.have.been.calledWith('statsd_metric_1', 1, tags);
    expect(client?.increment).to.have.been.calledWith('statsd_metric_2', 1, tags);
  });

  // it(`.reset(${JSON.stringify(resetOptions)}) to log the right message`, function () {
  //   counter?.reset(resetOptions as LabelOptions);

  //   expect(counter?.logger.debug).to.have.been.called;
  //   expect(counter?.logger.debug).to.have.been.calledWith(mlm`Counter.reset${resetOptions}`);
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
