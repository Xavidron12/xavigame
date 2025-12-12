module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // =========================
    // DESACTIVAR ESTILO ESTRICTO
    // =========================
    semi: 'off',
    quotes: 'off',
    'space-before-function-paren': 'off',
    'no-multi-spaces': 'off',
    'padded-blocks': 'off',
    curly: 'off',
    'eol-last': 'off',
    'import/first': 'off',

    // =========================
    // GAME / SPA FRIENDLY
    // =========================
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
}
