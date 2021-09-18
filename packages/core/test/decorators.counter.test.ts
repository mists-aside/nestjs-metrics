/* eslint-disable max-lines-per-function */
import chai, {expect} from 'chai';
import {describe, it} from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {Config, MockAdapter} from '../src';
import {Controller} from '../src/test/controller';

chai.use(sinonChai);

describe('decorators', function () {
  let adapter1: MockAdapter;
  let adapter2: MockAdapter;
  let config: Config;
  let controller: Controller;
  let sandbox: sinon.SinonSandbox | undefined;

  describe('@Inc()', function () {
    beforeEach(function () {
      adapter1 = new MockAdapter('adapter_1');
      adapter2 = new MockAdapter('adapter_2');

      config = Config.getInstance();
      config.addAdapter(adapter1);
      config.addAdapter(adapter2);

      controller = Controller.getInstance();

      sandbox = sinon.createSandbox();
      sandbox.spy(adapter1.getCounter(), 'inc');
      sandbox.spy(adapter2.getCounter(), 'inc');
    });

    afterEach(function () {
      sandbox?.restore();
      sandbox = undefined;

      config.clear();
    });

    it('Controller.incByDecorator() should call Counter.inc method for all adapters & metrics', function () {
      controller.incByDecorator();

      expect(adapter1.getCounter().inc).to.have.been.called;
      expect(adapter1.getCounter().inc).to.have.been.calledWith({labels: ['inc_metric_1']});

      expect(adapter2.getCounter().inc).to.have.been.called;
      expect(adapter2.getCounter().inc).to.have.been.calledWith({labels: ['inc_metric_1']});
    });

    it(
      'Controller.incByDecoratorMultipleLabels() ' + 'should call Counter.inc method for all adapters & metrics',
      function () {
        controller.incByDecoratorMultipleLabels();

        expect(adapter1.getCounter().inc).to.have.been.called;
        expect(adapter1.getCounter().inc).to.have.been.calledWith({labels: ['inc_metric_1', 'inc_metric_2']});

        expect(adapter2.getCounter().inc).to.have.been.called;
        expect(adapter2.getCounter().inc).to.have.been.calledWith({labels: ['inc_metric_1', 'inc_metric_2']});
      },
    );

    it(
      'Controller.incByDecoratorWithAdapterList() ' +
        'should call Counter.inc method for `adapter_1` adapter & metrics',
      function () {
        controller.incByDecoratorWithAdapterList();

        expect(adapter1.getCounter().inc).to.have.been.called;
        expect(adapter1.getCounter().inc).to.have.been.calledWith({labels: ['inc_metric_1']});

        expect(adapter2.getCounter().inc).to.not.have.been.called;
      },
    );

    it('generic', () => {
      expect(true).to.equal(true);
    });
  });
});
