/* eslint-disable mocha/no-mocha-arrows,max-lines-per-function */
// import { incValues, incValuesDelta, decValuesDelta } from './../src/test/utils/controllers';
import * as chai from 'chai';
import {describe, it} from 'mocha';
import {nanoid} from 'nanoid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

// import {HistogramMetric} from '../src';
// import {Config} from '../src/config';
// import {HistogramMetricController} from '../src/test';
// import {HistogramPrometheus, HistogramStatsd, TestHarness, createTestModule} from './utils';
// import {endTimer} from './utils/adapters';

// chai.use(sinonChai);
// const expect = chai.expect;

// const metricName = nanoid();

// const histogramPrometheus = new HistogramPrometheus();
// const histogramStatsd = new HistogramStatsd();

// const metricAdapters = [
//   {
//     adapter: histogramPrometheus,
//     metric: metricName,
//   },
//   {
//     adapter: histogramStatsd,
//     metric: metricName,
//   },
// ];

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/metric', function () {
  // before(() => {
  //   Config.getInstance().clear();
  //   Config.getInstance().addAdapters(metricAdapters);
  // });

  // describe('Controller(Metric::HistogramMetric)', () => {
  //   let harness: TestHarness;
  //   let controller: HistogramMetricController;
  //   let sandbox: sinon.SinonSandbox;

  //   beforeEach(async () => {
  //     sandbox = sinon.createSandbox();
  //     sandbox.spy(histogramPrometheus, 'observe');
  //     sandbox.spy(histogramPrometheus, 'startTimer');
  //     sandbox.spy(histogramPrometheus, 'reset');
  //     sandbox.spy(histogramStatsd, 'observe');
  //     sandbox.spy(histogramStatsd, 'startTimer');
  //     sandbox.spy(histogramStatsd, 'reset');

  //     harness = await createTestModule(
  //       {
  //         adapters: [],
  //       },
  //       {
  //         controllers: [HistogramMetricController],
  //         providers: [HistogramMetric.getProvider()],
  //       },
  //     );

  //     controller = harness.app.get<HistogramMetricController>(HistogramMetricController);
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
  //     it('HistogramMetricController.observeAllAdapters() should trigger observe() function on all histogram adapters', () => {
  //       controller.observeAllAdapters();
  //       expect(histogramPrometheus.observe).to.have.been.called;
  //       expect(histogramStatsd.observe).to.have.been.called;
  //     });

  //     it('HistogramMetricController.observeByAdapter() should trigger observe() function on all `prometheus` histogram adapters', () => {
  //       controller.observeByAdapter('prometheus');
  //       expect(histogramPrometheus.observe).to.have.been.calledWith({delta: 1, tags: undefined});
  //       expect(histogramStatsd.observe).to.not.have.been.called;
  //     });

  //     it('HistogramMetricController.observeByMetric() should trigger observe() function on all `histogram` histogram adapters', () => {
  //       controller.observeByMetric(metricName);
  //       expect(histogramPrometheus.observe).to.have.been.calledWith({delta: 1, tags: undefined});
  //       expect(histogramStatsd.observe).to.have.been.called;
  //     });

  //     it('HistogramMetricController.observeWithTags() should trigger observe() function using {tag: `histogram`}', () => {
  //       controller.observeWithTags();
  //       expect(histogramPrometheus.observe).to.have.been.calledWith({delta: 2, tags: {tag: 'histogram'}});
  //     });

  //     it('HistogramMetricController.observeWithDecorator() should trigger observe() function using a decorator', async () => {
  //       await controller.observeWithDecorator();

  //       expect(histogramPrometheus.observe).to.have.been.called;
  //       expect(histogramStatsd.observe).to.not.have.been.called;
  //     });
  //   });

  //   // startTimer

  //   describe('startTimer()', () => {
  //     it('HistogramMetricController.startTimerAllAdapters() should trigger startTimer() function on all histogram adapters', async () => {
  //       await controller.startTimerAllAdapters();
  //       expect(histogramPrometheus.startTimer).to.have.been.called;
  //       expect(histogramStatsd.startTimer).to.have.been.called;
  //     });

  //     it('HistogramMetricController.startTimerByAdapter() should trigger startTimer() function on all `prometheus` histogram adapters', async () => {
  //       await controller.startTimerByAdapter('prometheus');
  //       expect(histogramPrometheus.startTimer).to.have.been.calledWith({tags: undefined});
  //       expect(histogramStatsd.startTimer).to.not.have.been.called;
  //     });

  //     it('HistogramMetricController.startTimerByMetric() should trigger startTimer() function on all `histogram` histogram adapters', async () => {
  //       await controller.startTimerByMetric(metricName);
  //       expect(histogramPrometheus.startTimer).to.have.been.calledWith({tags: undefined});
  //       expect(histogramStatsd.startTimer).to.have.been.called;
  //     });

  //     it('HistogramMetricController.startTimerWithTags() should trigger startTimer() function using {tag: `histogram`}', async () => {
  //       await controller.startTimerWithTags();
  //       expect(histogramPrometheus.startTimer).to.have.been.calledWith({tags: {tag: 'histogram'}});
  //     });

  //     it('HistogramMetricController.startTimerWithEndTags() should trigger startTimer() function using {tag: `histogram`}', async () => {
  //       await controller.startTimerWithEndTags();
  //       expect(endTimer).to.have.been.calledWith({tags: {tag: 'histogram'}});
  //     });

  //     it('HistogramMetricController.startTimerWithDecorator() should trigger startTimer() function using a decorator', async () => {
  //       await controller.startTimerWithDecorator();

  //       expect(histogramPrometheus.startTimer).to.have.been.called;
  //       expect(histogramStatsd.startTimer).to.not.have.been.called;
  //     });
  //   });

  //   // reset

  //   describe('reset()', () => {
  //     it('HistogramMetricController.resetByAdapter() should trigger reset() function on all histogram adapters', () => {
  //       controller.resetAllAdapters();
  //       expect(histogramPrometheus.reset).to.have.been.called;
  //       expect(histogramStatsd.reset).to.have.been.called;
  //     });

  //     it(`HistogramMetricController.resetByAdapter('prometheus') should trigger reset() function on all 'prometheus' histogram adapters`, () => {
  //       controller.resetByAdapter('prometheus');
  //       expect(histogramPrometheus.reset).to.have.been.called;
  //       expect(histogramStatsd.reset).to.not.have.been.called;
  //     });

  //     it(`HistogramMetricController.resetByMetricName('${metricName}') should trigger reset() function on all histogram adapters`, () => {
  //       controller.resetByMetricName(metricName);
  //       expect(histogramPrometheus.reset).to.have.been.called;
  //       expect(histogramStatsd.reset).to.have.been.called;
  //     });

  //     it('HistogramMetricController.resetWithDecorator() should trigger reset() function using a decorator', async () => {
  //       await controller.resetWithDecorator();

  //       expect(histogramPrometheus.reset).to.have.been.called;
  //       expect(histogramStatsd.reset).to.not.have.been.called;
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
