import {expect} from 'chai';
import {describe, it} from 'mocha';
import {Config, PrometheusOptions, StatsdOptions, StatsTypes} from '../src/config';

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

  it('Config.setTypes() will set options', async () => {
    const types = [StatsTypes.Prometheus];
    config.setTypes(types);
    expect(config.types).to.equal(types);
  });
});
