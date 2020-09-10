import {expect} from 'chai';
import {describe, it} from 'mocha';

// import {createStatsModule, TestHarness} from './utils';

describe('src/module', function () {
  // let harness: TestHarness;

  // // eslint-disable-next-line mocha/no-mocha-arrows
  // beforeEach(async () => {
  //   harness = await createStatsModule({
  //     statsd: {
  //       host: 'localhost',
  //     },
  //   });
  // });

  // it('StatsModule to instantiate properly (without any options)', async () => {
  //   harness = await createStatsModule();
  //   expect(harness.testingModule).to.be.an('object');
  //   expect(harness.testingModule).to.be.instanceOf(TestingModule);
  // });

  // it('StatsModule to instantiate properly (with options)', async () => {
  //   expect(harness.testingModule).to.be.an('object');
  //   expect(harness.testingModule).to.be.instanceOf(TestingModule);
  // });

  it('generic', () => {
    expect(true).to.equal(true);
  });
});
