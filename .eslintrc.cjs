module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true,
    },
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script',
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
    plugins: ['node'],
    rules: {
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-missing-require': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    ignorePatterns: ['public/**', 'node_modules/**', 'docs/**', '.github/**'],
};
