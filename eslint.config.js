// Flat ESLint config for ESLint v9+

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
    {
        ignores: ['public/**', 'node_modules/**', 'docs/**', '.github/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                process: 'readonly',
                __dirname: 'readonly',
                module: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
