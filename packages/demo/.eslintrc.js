// .babelrc.js

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    /************************************************************************
     * Uncomment to add airbnb rules. Don't forget you need to install
     * the airbnb eslint plugin.
     * ```bash
     * npm i -D eslint-config-airbnb-base
     * # or
     * yarn add --dev eslint-config-airbnb-typescript
     * ```
     */
    // 'airbnb-typescript/base'
    'plugin:mocha/recommended',
    'plugin:sonar/recommended',
    'plugin:sonarjs/recommended',
    // comment to remove mocha rules
    'plugin:mocha/recommended',
    /************************************************************************
     * Uncomment to add jest rules. Don't forget you need to install
     * the jest eslint plugin.
     * ```bash
     * npm i -D eslint-plugin-jest
     * # or
     * yarn add --dev eslint-plugin-jest
     * ```
     */
    // 'plugin:jest/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'sonar', 'sonarjs'],
  root: true,
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
    'consistent-return': 2,
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', 120],
    'max-lines-per-function': ['warn', 40],
    'max-params': ['error', 3],
    'no-else-return': 1,
    'sonar/no-invalid-await': 0,
    'space-unary-ops': 2,
    curly: ['error', 'all'],
    indent: [1, 2],
    semi: [1, 'always'],
  },
};
