import {expect} from 'chai';
import {describe, it} from 'mocha';
import {Config} from '../src/config';
import {PrometheusOptions} from '../src/prometheus/options';
import {StatsdOptions} from '../src/statsd/options';

describe('src/config', function () {
  let config: Config;

  // eslint-disable-next-line mocha/no-mocha-arrows
  beforeEach(async () => {
    config = new Config();
  });

  it('Config.setPrometheusOptions() will set options', async () => {
    const options: PrometheusOptions = {
      defaultMetrics: {
        enabled: true,
        config: {},
      },
    };
    config.setPrometheusOptions(options);
    expect(config.prometheus).to.equal(options);
  });

  it('Config.setStatsdOptions() will set options', async () => {
    const options: StatsdOptions = {
      host: 'test',
    };
    config.setStatsdOptions(options);
    expect(config.statsd).to.equal(options);
  });
});
