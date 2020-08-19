/**
 * If you're writing a multi package application, https://lerna.js.org/ should
 * be the solution for you.
 */

import babel from "@rollup/plugin-babel";

const isProduction = process.env.NODE_ENV === "production";

const entryName = "index";

/**
 * Replace this with the name of your module
 */
const name = "javascript-template";

const bab = () =>
  babel({
    // cacheRoot: '.rollupcache',
    babelHelpers: "bundled",
  });

export default [
  {
    input: `src/${entryName}.js`,
    output: [
      {
        file: `dist/es2015/${entryName}.js`,
        format: "es",
      },
      {
        file: `dist/umd-es2015/${entryName}.js`,
        format: "umd",
        name: name,
      },
    ],
    plugins: [bab()],
  },
].concat(
  !isProduction
    ? []
    : [
        {
          input: `src/${entryName}.js`,
          output: {
            // @bab-ignore
            file: `dist/es2017/${entryName}.js`,
            format: "es",
          },
          plugins: [bab()],
        },
        {
          input: `src/${entryName}.js`,
          output: [
            { file: `dist/commonjs/${entryName}.js`, format: "cjs" },
            {
              file: `dist/amd/${entryName}.js`,
              format: "amd",
              amd: { id: entryName },
            },
            { file: `dist/native-modules/${entryName}.js`, format: "es" },
            { file: `dist/umd/${entryName}.js`, format: "umd", name: name },
            { file: `dist/system/${entryName}.js`, format: "system" },
          ],
          plugins: [bab()],
        },
      ]
);
