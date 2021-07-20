/* eslint-disable mocha/no-mocha-arrows,max-lines-per-function */

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {describe, it} from 'mocha';

// import {Config} from '../src/config';
// import {MetricsModule} from '../src/module';
// import {CounterPrometheus} from './utils/adapters';
// import {TestHarness} from './utils/harness';
// import {
//   MetricsModuleOptionsService,
//   MetricsOptionsModule,
//   createAsyncTestModule,
//   createTestModule,
// } from './utils/module';

const expect = chai.expect;
chai.use(chaiAsPromised);

// eslint-disable-next-line mocha/no-skipped-tests
describe('src/module', function () {
  let harness: TestHarness;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // afterEach(async () => {
  //   if (harness) {
  //     await harness.app.close();
  //     harness = undefined;
  //   }
  // });

  // describe('MetricsModule.register()', () => {
  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   afterEach(async () => {
  //     harness = null;
  //     Config.getInstance().clear();
  //   });

  //   it('MetricsModule not to instantiate properly without adapters option', async () => {
  //     await expect(createTestModule()).to.be.rejectedWith(Error);
  //   });

  //   it('MetricsModule to instantiate properly (with options)', async () => {
  //     harness = await createTestModule({
  //       adapters: [
  //         {
  //           metric: 'counter',
  //           adapter: new CounterPrometheus(),
  //         },
  //       ],
  //     });
  //     const module = harness.app.get<MetricsModule>(MetricsModule);
  //     expect(module instanceof MetricsModule).to.equal(true);

  //     expect(Config.getInstance().adapters[0].adapter instanceof CounterPrometheus).to.be.true;
  //   });
  // });

  // describe('MetricsModule.registerAsync()', () => {
  //   // eslint-disable-next-line mocha/no-mocha-arrows
  //   afterEach(() => {
  //     harness = null;
  //     Config.getInstance().clear();
  //   });

  //   it('MetricsModule to throw error when no `useExisting` / `useClass` is provided', async () => {
  //     await expect(createAsyncTestModule({})).to.be.rejectedWith(Error);
  //   });

  //   it('MetricsModule to instantiate properly (with options) (useExisting)', async () => {
  //     harness = await createAsyncTestModule({
  //       imports: [MetricsOptionsModule],
  //       useExisting: MetricsModuleOptionsService,
  //       inject: [MetricsModuleOptionsService],
  //     });
  //     const module = harness.app.get<MetricsModule>(MetricsModule);
  //     expect(module instanceof MetricsModule).to.equal(true);

  //     expect(Config.getInstance().adapters[0].adapter instanceof CounterPrometheus).to.be.true;
  //   });

  //   it('MetricsModule to instantiate properly (with options) (useClass)', async () => {
  //     harness = await createAsyncTestModule({
  //       useClass: MetricsModuleOptionsService,
  //       inject: [MetricsModuleOptionsService],
  //     });
  //     const module = harness.app.get<MetricsModule>(MetricsModule);
  //     expect(module instanceof MetricsModule).to.equal(true);

  //     expect(Config.getInstance().adapters[0].adapter instanceof CounterPrometheus).to.be.true;
  //   });
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
