/* eslint-disable mocha/no-mocha-arrows,max-lines-per-function */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

// import {SummaryMetric} from '../src';
// import {Config} from '../src/config';
// import {SummaryMetricController} from '../src/test';
// import {SummaryPrometheus, SummaryStatsd, TestHarness, createTestModule} from './utils';
// import {endTimer} from './utils/adapters';

// chai.use(sinonChai);
// const {expect} = chai;

// const metricName = nanoid();

// const summaryPrometheus = new SummaryPrometheus();
// const summaryStatsd = new SummaryStatsd();

// const metricAdapters = [
//   {
//     adapter: summaryPrometheus,
//     metric: metricName,
//   },
//   {
//     adapter: summaryStatsd,
//     metric: metricName,
//   },
// ];

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  // before(() => {
  //   Config.getInstance().clear();
  //   Config.getInstance().addAdapters(metricAdapters);
  // });

  // describe('Controller(Metric::SummaryMetric)', () => {
  //   let harness: TestHarness;
  //   let controller: SummaryMetricController;
  //   let sandbox: sinon.SinonSandbox;

  //   beforeEach(async () => {
  //     sandbox = sinon.createSandbox();
  //     sandbox.spy(summaryPrometheus, 'observe');
  //     sandbox.spy(summaryPrometheus, 'startTimer');
  //     sandbox.spy(summaryPrometheus, 'reset');
  //     sandbox.spy(summaryStatsd, 'observe');
  //     sandbox.spy(summaryStatsd, 'startTimer');
  //     sandbox.spy(summaryStatsd, 'reset');

  //     harness = await createTestModule(
  //       {
  //         adapters: [],
  //       },
  //       {
  //         controllers: [SummaryMetricController],
  //         providers: [SummaryMetric.getProvider()],
  //       },
  //     );

  //     controller = harness.app.get<SummaryMetricController>(SummaryMetricController);
  //   });

  //   afterEach(async () => {
  //     await harness.app.close();

  //     harness = undefined;
  //     controller = undefined;

  //     sandbox.restore();
  //     sandbox = undefined;
  //   });

  //   // observe

  //   describe('observe()', () => {
  //     it(
  //       'SummaryMetricController.observeAllAdapters() should trigger ' + 'observe() function on all summary adapters',
  //       () => {
  //         controller.observeAllAdapters();
  //         expect(summaryPrometheus.observe).to.have.been.called;
  //         expect(summaryStatsd.observe).to.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.observeByAdapter() should trigger ' +
  //         'observe() function on all `prometheus` summary adapters',
  //       () => {
  //         controller.observeByAdapter('prometheus');
  //         expect(summaryPrometheus.observe).to.have.been.calledWith({delta: 1, tags: undefined});
  //         expect(summaryStatsd.observe).to.not.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.observeByMetric() should trigger ' +
  //         'observe() function on all `summary` summary adapters',
  //       () => {
  //         controller.observeByMetric(metricName);
  //         expect(summaryPrometheus.observe).to.have.been.calledWith({delta: 1, tags: undefined});
  //         expect(summaryStatsd.observe).to.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.observeWithTags() should trigger ' + 'observe() function using {tag: `summary`}',
  //       () => {
  //         controller.observeWithTags();
  //         expect(summaryPrometheus.observe).to.have.been.calledWith({delta: 2, tags: {tag: 'summary'}});
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.observeWithDecorator() should trigger ' + 'observe() function using a decorator',
  //       async () => {
  //         await controller.observeWithDecorator();

  //         expect(summaryPrometheus.observe).to.have.been.called;
  //         expect(summaryStatsd.observe).to.not.have.been.called;
  //       },
  //     );
  //   });

  //   // startTimer

  //   describe('startTimer()', () => {
  //     it(
  //       'SummaryMetricController.startTimerAllAdapters() should trigger ' +
  //         'startTimer() function on all summary adapters',
  //       async () => {
  //         await controller.startTimerAllAdapters();
  //         expect(summaryPrometheus.startTimer).to.have.been.called;
  //         expect(summaryStatsd.startTimer).to.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.startTimerByAdapter() should trigger ' +
  //         'startTimer() function on all `prometheus` summary adapters',
  //       async () => {
  //         await controller.startTimerByAdapter('prometheus');
  //         expect(summaryPrometheus.startTimer).to.have.been.calledWith({tags: undefined});
  //         expect(summaryStatsd.startTimer).to.not.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.startTimerByMetric() should trigger ' +
  //         'startTimer() function on all `summary` summary adapters',
  //       async () => {
  //         await controller.startTimerByMetric(metricName);
  //         expect(summaryPrometheus.startTimer).to.have.been.calledWith({tags: undefined});
  //         expect(summaryStatsd.startTimer).to.have.been.called;
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.startTimerWithTags() should trigger ' + 'startTimer() function using {tag: `summary`}',
  //       async () => {
  //         await controller.startTimerWithTags();
  //         expect(summaryPrometheus.startTimer).to.have.been.calledWith({tags: {tag: 'summary'}});
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.startTimerWithEndTags() should trigger ' +
  //         'startTimer() function using {tag: `summary`}',
  //       async () => {
  //         await controller.startTimerWithEndTags();
  //         expect(endTimer).to.have.been.calledWith({tags: {tag: 'summary'}});
  //       },
  //     );

  //     it(
  //       'SummaryMetricController.startTimerWithDecorator() should trigger ' + 'startTimer() function using a decorator',
  //       async () => {
  //         await controller.startTimerWithDecorator();

  //         expect(summaryPrometheus.startTimer).to.have.been.called;
  //         expect(summaryStatsd.startTimer).to.not.have.been.called;
  //       },
  //     );
  //   });

  //   // reset

  //   describe('reset()', () => {
  //     it(
  //       'SummaryMetricController.resetByAdapter() should trigger reset() ' + 'function on all summary adapters',
  //       () => {
  //         controller.resetAllAdapters();
  //         expect(summaryPrometheus.reset).to.have.been.called;
  //         expect(summaryStatsd.reset).to.have.been.called;
  //       },
  //     );

  //     it(
  //       `SummaryMetricController.resetByAdapter('prometheus') should trigger ` +
  //         `reset() function on all 'prometheus' summary adapters`,
  //       () => {
  //         controller.resetByAdapter('prometheus');
  //         expect(summaryPrometheus.reset).to.have.been.called;
  //         expect(summaryStatsd.reset).to.not.have.been.called;
  //       },
  //     );

  //     it(
  //       `SummaryMetricController.resetByMetricName('${metricName}') should trigger ` +
  //         `reset() function on all summary adapters`,
  //       () => {
  //         controller.resetByMetricName(metricName);
  //         expect(summaryPrometheus.reset).to.have.been.called;
  //         expect(summaryStatsd.reset).to.have.been.called;
  //       },
  //     );

  //     it('SummaryMetricController.resetWithDecorator() should trigger reset() function using a decorator', async () => {
  //       await controller.resetWithDecorator();

  //       expect(summaryPrometheus.reset).to.have.been.called;
  //       expect(summaryStatsd.reset).to.not.have.been.called;
  //     });
  //   });

  //   it('generic', () => {
  //     expect(true).to.equal(true);
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
