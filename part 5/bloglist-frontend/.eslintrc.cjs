module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'],
  rules: {
    'indent': [
      'error',
  ],
  'linebreak-style': [
      'error',
      'window'
  ],
  'quotes': [
      'error',
      'single'
  ],
  'semi': [
      'error',
      'never'
  ],
  'eqeqeq': 'error',
  'no-trailing-spaces': 'error',
  'object-curly-spacing': [
      'error', 'always'
  ],
  'arrow-spacing': [
      'error', { 'before': true, 'after': true }
  ],
  'no-console': 0
},
}
