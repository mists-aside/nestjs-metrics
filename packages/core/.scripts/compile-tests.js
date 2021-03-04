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
    adapterMethod: 'inc',
    adapterType: 'counter',
  };
  const incMethods = await twig('./.scripts/twig/src/test/controller/countable.methods.ts.twig', counter);
  const countableController = await twig('./.scripts/twig/src/test/controller/partial/controller.ts.twig', {...counter, incMethods});
  await fs.promises.writeFile('./src/test/controllers/counter.ts', beautify(countableController));
}

const renderMetricCounterTests = async () => {
  const counter = {
    adapterMethod: 'inc',
    adapterType: 'counter',
    controllerClass: 'CounterMetricController',
  };
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', counter);
  const countableTests = await twig('./.scripts/twig/test/metric-counter.test.ts.twig', {...counter, incTests});
  await fs.promises.writeFile('./test/metric-counter.test.ts', beautify(countableTests));
}

const renderMetricGaugeTests = async () => {
  const gauge = {
    adapterMethod: 'inc',
    adapterType: 'gauge',
    controllerClass: 'GaugeMetricController',
  };
  const decTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', {...gauge, adapterMethod: 'dec'});
  const incTests = await twig('./.scripts/twig/test/partials/countable.tests.ts.twig', gauge);
  const setTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...gauge, adapterMethod: 'set'});
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...gauge, adapterMethod: 'startTimer'});
  const countableTests = await twig('./.scripts/twig/test/metric-gauge.test.ts.twig', {...gauge, incTests, decTests, setTests, timingTests});
  await fs.promises.writeFile('./test/metric-gauge.test.ts', countableTests);
}

const renderMetricObservableTests = async (adapterType = 'histogram') => {
  const histogram = {
    adapterMethod: 'observe',
    adapterType,
    controllerClass: `${adapterType.slice(0, 1).toUpperCase()}${adapterType.slice(1)}MetricController`,
  };
  const observeTests = await twig('./.scripts/twig/test/partials/observable.tests.ts.twig', {...histogram});
  const timingTests = await twig('./.scripts/twig/test/partials/timing.tests.ts.twig', {...histogram, adapterMethod: 'startTimer'});
  const countableTests = await twig('./.scripts/twig/test/metric-observable.test.ts.twig', {...histogram, observeTests, timingTests});
  await fs.promises.writeFile(`./test/metric-${adapterType}.test.ts`, countableTests);
}

const main = async () => {
  try {
    await renderCounterMetricController();
    await renderMetricCounterTests();

    // await renderMetricGaugeTests();
    // await renderMetricObservableTests();
    // await renderMetricObservableTests('summary');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
