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

const renderCounterMetricController = async () => {
  const counter = {
    metricMethod: 'inc',
    metricType: 'counter',
  };
  const incMethods = await twig('./.scripts/twig/src/test/controller/partials/countable.methods.ts.twig', counter);
  const resetMethods = await twig('./.scripts/twig/src/test/controller/partials/reset.methods.ts.twig', counter);
  const countableController = await twig('./.scripts/twig/src/test/controller/counter.ts.twig', {...counter, incMethods, resetMethods});
  await fs.promises.writeFile('./src/test/controllers/counter.ts', beautify(countableController));
}

const renderMetricCounterTests = async () => {
  const counter = {
    metricMethod: 'inc',
    metricType: 'counter',
    controllerClass: 'CounterMetricController',
  };
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', counter);
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', counter);
  const countableTests = await twig('./.scripts/twig/test/metric-counter.test.ts.twig', {...counter, incTests, resetTests});
  await fs.promises.writeFile('./test/metric-counter.test.ts', beautify(countableTests));
}

const renderGaugeMetricController = async () => {
  const counter = {
    metricMethod: 'inc',
    metricType: 'gauge',
  };
  const decMethods = await twig('./.scripts/twig/src/test/controller/partials/countable.methods.ts.twig', {...counter, metricMethod: 'dec'});
  const incMethods = await twig('./.scripts/twig/src/test/controller/partials/countable.methods.ts.twig', counter);
  const setMethods = await twig('./.scripts/twig/src/test/controller/partials/observable.methods.ts.twig', {...counter, metricMethod: 'set'});
  const resetMethods = await twig('./.scripts/twig/src/test/controller/partials/reset.methods.ts.twig', counter);
  const timingMethods = await twig('./.scripts/twig/src/test/controller/partials/timing.methods.ts.twig', {...counter, metricMethod: 'startTimer'});
  const gaugeController = await twig('./.scripts/twig/src/test/controller/gauge.ts.twig', {...counter, decMethods, incMethods, resetMethods, setMethods, timingMethods});
  await fs.promises.writeFile('./src/test/controllers/gauge.ts', beautify(gaugeController));
}

const renderMetricGaugeTests = async () => {
  const gauge = {
    metricMethod: 'inc',
    metricType: 'gauge',
    controllerClass: 'GaugeMetricController',
  };
  const decTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', {...gauge, metricMethod: 'dec'});
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', gauge);
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', gauge);
  const setTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...gauge, metricMethod: 'set'});
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...gauge, metricMethod: 'startTimer'});
  const gaugeTests = await twig('./.scripts/twig/test/metric-gauge.test.ts.twig', {...gauge, incTests, decTests, resetTests, setTests, timingTests});
  await fs.promises.writeFile('./test/metric-gauge.test.ts', beautify(gaugeTests));
}

const renderObservableMetricController = async (metricType = 'histogram') => {
  const counter = {
    metricMethod: 'inc',
    metricType,
  };
  const observeMethods = await twig('./.scripts/twig/src/test/controller/partials/observable.methods.ts.twig', {...counter, metricMethod: 'observe'});
  const resetMethods = await twig('./.scripts/twig/src/test/controller/partials/reset.methods.ts.twig', counter);
  const timingMethods = await twig('./.scripts/twig/src/test/controller/partials/timing.methods.ts.twig', {...counter, metricMethod: 'startTimer'});
  const observableController = await twig('./.scripts/twig/src/test/controller/observable.ts.twig', {...counter, observeMethods, resetMethods, timingMethods});
  await fs.promises.writeFile(`./src/test/controllers/${metricType}.ts`, beautify(observableController));
}

const renderMetricObservableTests = async (metricType = 'histogram') => {
  const histogram = {
    metricMethod: 'observe',
    metricType,
    controllerClass: `${metricType.slice(0, 1).toUpperCase()}${metricType.slice(1)}MetricController`,
  };
  const observeTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...histogram});
  const resetTests = await twig('./.scripts/twig/test/partials/reset.tests.ts.twig', histogram);
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...histogram, metricMethod: 'startTimer'});
  const observableTests = await twig('./.scripts/twig/test/metric-observable.test.ts.twig', {...histogram, observeTests, resetTests, timingTests});
  await fs.promises.writeFile(`./test/metric-${metricType}.test.ts`, beautify(observableTests));
}

const main = async () => {
  try {
    await renderCounterMetricController();
    await renderMetricCounterTests();

    await renderGaugeMetricController();
    await renderMetricGaugeTests();

    await renderObservableMetricController();
    await renderMetricObservableTests();

    await renderObservableMetricController('summary');
    await renderMetricObservableTests('summary');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
