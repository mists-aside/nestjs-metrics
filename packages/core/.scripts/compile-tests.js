const fs = require('fs');
const prettier = require('prettier');
const Twig = require('twig');

const twig = async (file, options) =>
  new Promise((resolve, reject) => {
    Twig.renderFile(file, options || {}, (err, html) => {
      if (!err) {
        return resolve(html);
      }
      reject(err);
    });
  });

const beautify = (html) => prettier.format(html, {
  parser: 'typescript',
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: false,
})

const renderCounterMetric = async () => {
  const options = {
    metricMethod: 'inc',
    metricType: 'counter',
    controllerClass: 'CounterMetricController',
  };

  //
  // metric
  //
  const metricIncMethod = await twig('./.scripts/twig/src/metrics/partials/countable.ts.twig', {...options});
  const metricResetMethod = await twig('./.scripts/twig/src/metrics/partials/reset.ts.twig', {...options});
  const counterMetric = await twig('./.scripts/twig/src/metrics/metric.ts.twig', {...options, methods: [metricIncMethod, metricResetMethod]});
  await fs.promises.writeFile('./src/metrics/counter.ts', beautify(counterMetric));

  //
  // controller
  //
  const controllerIncMethod = await twig('./.scripts/twig/src/test/controller/partials/countable.ts.twig', options);
  const controllerResetMethod = await twig('./.scripts/twig/src/test/controller/partials/reset.ts.twig', options);
  const counterController = await twig('./.scripts/twig/src/test/controller/counter.ts.twig', {...options, methods: [controllerIncMethod, controllerResetMethod]});
  await fs.promises.writeFile('./src/test/controllers/counter.ts', beautify(counterController));

  //
  // tests
  //
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', options);
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', {...options, metricMethod: 'reset'});
  const countableTests = await twig('./.scripts/twig/test/metric-counter.test.ts.twig', {...options, incTests, resetTests});
  await fs.promises.writeFile('./test/metric-counter.test.ts', beautify(countableTests));
}

const renderGaugeMetric = async () => {
  const options = {
    metricMethod: 'inc',
    metricType: 'gauge',
    controllerClass: 'GaugeMetricController',
  };

  // metric
  const metricDecMethods = await twig('./.scripts/twig/src/metrics/partials/countable.ts.twig', {...options, metricMethod: 'dec'});
  const metricIncMethods = await twig('./.scripts/twig/src/metrics/partials/countable.ts.twig', options);
  const metricResetMethods = await twig('./.scripts/twig/src/metrics/partials/reset.ts.twig', options);
  const metricSetMethods = await twig('./.scripts/twig/src/metrics/partials/observable.ts.twig', {...options, metricMethod: 'set'});
  const metricTimingMethods = await twig('./.scripts/twig/src/metrics/partials/timing.ts.twig', {...options, metricMethod: 'startTimer'});
  const gaugeController = await twig('./.scripts/twig/src/metrics/metric.ts.twig', {...options, methods: [metricDecMethods, metricIncMethods, metricResetMethods, metricSetMethods, metricTimingMethods]});
  await fs.promises.writeFile('./src/metrics/gauge.ts', beautify(gaugeController));

  // controller
  const decMethods = await twig('./.scripts/twig/src/test/controller/partials/countable.ts.twig', {...options, metricMethod: 'dec'});
  const incMethods = await twig('./.scripts/twig/src/test/controller/partials/countable.ts.twig', options);
  const resetMethods = await twig('./.scripts/twig/src/test/controller/partials/reset.ts.twig', options);
  const setMethods = await twig('./.scripts/twig/src/test/controller/partials/observable.ts.twig', {...options, metricMethod: 'set'});
  const timingMethods = await twig('./.scripts/twig/src/test/controller/partials/timing.ts.twig', {...options, metricMethod: 'startTimer'});
  const gaugeMetric = await twig('./.scripts/twig/src/test/controller/gauge.ts.twig', {...options, methods: [decMethods, incMethods, resetMethods, setMethods, timingMethods]});
  await fs.promises.writeFile('./src/test/controllers/gauge.ts', beautify(gaugeMetric));

  // tests
  const decTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', {...options, metricMethod: 'dec'});
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', options);
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', {...options, metricMethod: 'reset'});
  const setTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...options, metricMethod: 'set'});
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...options, metricMethod: 'startTimer'});
  const gaugeTests = await twig('./.scripts/twig/test/metric-gauge.test.ts.twig', {...options, incTests, decTests, resetTests, setTests, timingTests});
  await fs.promises.writeFile('./test/metric-gauge.test.ts', beautify(gaugeTests));
}


const renderObservableMetric = async (metricType = 'histogram') => {
  const options = {
    metricMethod: 'inc',
    metricType,
    controllerClass: `${metricType.slice(0, 1).toUpperCase()}${metricType.slice(1)}MetricController`,
  };

  // metric
  const metricObserveMethods = await twig('./.scripts/twig/src/metrics/partials/observable.ts.twig', {...options, metricMethod: 'observe'});
  const metricResetMethods = await twig('./.scripts/twig/src/metrics/partials/reset.ts.twig', options);
  const metricTimingMethods = await twig('./.scripts/twig/src/metrics/partials/timing.ts.twig', {...options, metricMethod: 'startTimer'});
  const observeController = await twig('./.scripts/twig/src/metrics/metric.ts.twig', {...options, methods: [metricObserveMethods, metricResetMethods, metricTimingMethods]});
  await fs.promises.writeFile(`./src/metrics/${metricType}.ts`, beautify(observeController));

  // controller
  const observeMethods = await twig('./.scripts/twig/src/test/controller/partials/observable.ts.twig', {...options, metricMethod: 'observe'});
  const resetMethods = await twig('./.scripts/twig/src/test/controller/partials/reset.ts.twig', options);
  const timingMethods = await twig('./.scripts/twig/src/test/controller/partials/timing.ts.twig', {...options, metricMethod: 'startTimer'});
  const observableController = await twig('./.scripts/twig/src/test/controller/observable.ts.twig', {...options, methods: [observeMethods, resetMethods, timingMethods]});
  await fs.promises.writeFile(`./src/test/controllers/${metricType}.ts`, beautify(observableController));

  // tests
  const observeTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...options, metricMethod: 'observe'});
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', {...options, metricMethod: 'reset'});
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...options, metricMethod: 'startTimer'});
  const observableTests = await twig('./.scripts/twig/test/metric-observable.test.ts.twig', {...options, observeTests, resetTests, timingTests});
  await fs.promises.writeFile(`./test/metric-${metricType}.test.ts`, beautify(observableTests));
}

const main = async () => {
  try {
    await renderCounterMetric();

    await renderGaugeMetric();

    await renderObservableMetric();

    await renderObservableMetric('summary');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
