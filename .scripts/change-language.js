const { copyFile, unlink, writeFile } = require("fs").promises;
const { readFileSync } = require("fs");
const path = require("path");

const package = JSON.parse(readFileSync("./package.json"));

const args = process.argv.slice(2);

const noUnlink =
  args.filter((item) => item.toLowerCase() === "--no-unlink").length != 0;

const language = process.argv[2];

const dependencies = {
  javascript: {},
  typescript: {},
};

const devDependencies = {
  javascript: {
    "@babel/cli": "^7.8.4",
    "@babel/core": "^7.9.6",
    "@babel/node": "^7.8.7",
    "@babel/preset-env": "^7.9.6",
    "@babel/register": "^7.9.0",
    "@rollup/plugin-babel": "^5.0.2",
    "babel-eslint": "^10.1.0",
    documentation: "^13.0.0",
    // esdoc: "^1.1.0",
    // "esdoc-standard-plugin": "^1.0.0",
  },
  typescript: {
    "@types/chai": "^4.2.11",
    "@types/mocha": "^7.0.2",
    "@types/node": "^13.13.4",
    "@typescript-eslint/eslint-plugin": "^2.30.0",
    "@typescript-eslint/parser": "^2.30.0",
    "rollup-plugin-dts": "^1.4.7",
    "rollup-plugin-typescript2": "^0.27.1",
    "ts-node": "^8.10.1",
    typedoc: "^0.17.7",
    typescript: "^3.8.3",
  },
};

const scripts = {
  javascript: {
    docs:
      "documentation build src/** -f html -o docs; documentation build src/** -f json -o docs.json",
    // esdocs: "esdoc; documentation build src/** -f json -o docs.json",
    "git-hook:pre-commit":
      "npm run prettier:write && npm run lint:write && npm run jscpd && npm run depcruise && npm run test",
    prettier: "prettier ./{src,test}/**/*.js",
    // prettier: 'prettier ./{src,test}/**/*.{js,jsx}',
    jscpd: "jscpd ./src --blame --format javascript",
    lint: "eslint ./{src,test}/**/*.js",
    // lint: 'eslint ./{src,test}/**/*.{js,jsx}',
    test: "npm run test:single -- './test/**/*.test.js'",
    "test:single":
      "nyc --reporter=html --reporter=lcov --reporter=text --extension .js mocha --forbid-only",
  },
  typescript: {
    docs:
      "npx typedoc --out docs --json docs.json --readme none --theme minimal --mode file src",
    "git-hook:pre-commit":
      "npm run prettier:write && npm run lint:write && npm run jscpd && npm run depcruise && npm run test",
    prettier: "prettier ./{src,test}/**/*.ts",
    // prettier: 'prettier ./{src,test}/**/*.{ts,tsx}',
    jscpd: "jscpd ./src --blame --format typescript",
    lint: "eslint ./{src,test}/**/*.ts",
    // lint: 'eslint ./{src,test}/**/*.{ts,tsx}',
    test: "npm run test:single -- 'test/**/*.test.ts'",
    "test:single":
      "nyc --reporter=html --reporter=lcov --reporter=text --extension .ts mocha --forbid-only",
  },
};

const sortByKeys = (obj) => {
  let keys = Object.getOwnPropertyNames(obj).sort();
  const newObj = {};
  for (key of keys) {
    if (typeof obj[key] !== "object" && !Array.isArray(obj[key])) {
      newObj[key] = obj[key];
    } else {
      newObj[key] = sortByKeys(obj[key]);
    }
  }
  return newObj;
};

/**
 * @param {{}} obj
 * @param {string[]} keys
 */
const removeKeys = (obj, keys) => {
  const newObj = {};
  const okeys = Object.getOwnPropertyNames(obj).filter((key) =>
    keys.find((lkey) => lkey === key)
  );
  for (const okey of okeys) {
    newObj[okey] = obj[okey];
  }
  return newObj;
};

const config = async () => {
  switch (language.toLowerCase()) {
    case "none":
      package.devDependencies = removeKeys(
        package.devDependencies,
        Object.getOwnPropertyNames(devDependencies.javascript)
      );
      package.devDependencies = removeKeys(
        package.devDependencies,
        Object.getOwnPropertyNames(devDependencies.typescript)
      );
      package.dependencies = removeKeys(
        package.dependencies,
        Object.getOwnPropertyNames(dependencies.javascript)
      );
      package.dependencies = removeKeys(
        package.dependencies,
        Object.getOwnPropertyNames(dependencies.typescript)
      );
      package.scripts = removeKeys(
        package.scripts,
        Object.getOwnPropertyNames(scripts.javascript)
      );
      package.scripts = removeKeys(
        package.scripts,
        Object.getOwnPropertyNames(scripts.typescript)
      );
      package.gitHooks = removeKeys(package.gitHooks, ["pre-commit"]);

      if (!noUnlink) {
        await unlink(".eslintrc.js");
        await unlink(".mocharc.js");
        await unlink(".prettierrc.js");
      }
      break;
    case "javascript":
      package.devDependencies = Object.assign(
        {},
        package.devDependencies,
        devDependencies.javascript
      );
      package.dependencies = Object.assign(
        {},
        package.dependencies,
        dependencies.javascript
      );
      package.scripts = Object.assign({}, package.scripts, scripts.javascript);
      package.gitHooks = Object.assign({}, package.gitHooks, {
        "pre-commit": "npm run git-hook:pre-commit && git add .",
      });
      await copyFile(".dependency-cruiser.javascript.js", ".dependency-cruiser.js");
      await copyFile(".eslintrc.javascript.js", ".eslintrc.js");
      await copyFile(".mocharc.javascript.js", ".mocharc.js");
      await copyFile(".prettierrc.javascript.js", ".prettierrc.js");
      await copyFile("rollup.config.javascript.js", "rollup.config.js");
      if (!noUnlink) {
        await unlink(path.join("src", "index.ts"));
        await unlink(path.join("test", "index.test.ts"));
        await unlink(path.join("test", "tsconfig.json"));
        await unlink("tsconfig.json");
        delete package.scripts["change:language"];
      }
      break;
    case "typescript":
      package.devDependencies = sortByKeys(
        Object.assign({}, package.devDependencies, devDependencies.typescript)
      );
      package.dependencies = sortByKeys(
        Object.assign({}, package.dependencies, dependencies.typescript)
      );
      package.scripts = sortByKeys(
        Object.assign({}, package.scripts, scripts.typescript)
      );
      package.gitHooks = Object.assign({}, package.gitHooks, {
        "pre-commit": "npm run git-hook:pre-commit && git add .",
      });
      await copyFile(".dependency-cruiser.typescript.js", ".dependency-cruiser.js");
      await copyFile(".eslintrc.typescript.js", ".eslintrc.js");
      await copyFile(".mocharc.typescript.js", ".mocharc.js");
      await copyFile(".prettierrc.typescript.js", ".prettierrc.js");
      await copyFile("rollup.config.typescript.js", "rollup.config.js");
      if (!noUnlink) {
        await unlink(".babelrc.js");
        await unlink(path.join("src", "index.js"));
        await unlink(path.join("test", "index.test.js"));
        delete package.scripts["change:language"];
      }
      break;
    default:
      console.error(
        "No language selected. Please chose between: javascript and typescrypt"
      );
      process.exit(1);
  }
  if (!noUnlink) {
    for (const lang of Object.getOwnPropertyNames(scripts)) {
      await unlink(`.eslintrc.${lang}.js`);
      await unlink(`.dependency-cruiser.${lang}.js`);
      await unlink(`.mocharc.${lang}.js`);
      await unlink(`.prettierrc.${lang}.js`);
      await unlink(`rollup.config.${lang}.js`);
    }

    delete package.scripts["change:language"];
  }

  writeFile("package.json", JSON.stringify(package, null, 2), "utf-8");
};

config();
