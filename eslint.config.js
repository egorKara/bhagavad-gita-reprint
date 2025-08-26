import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettier,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                URLSearchParams: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-template': 'error',
        },
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/*.min.js',
            '**/coverage/**',
            '**/frontend-backup/**',
            '**/public-backup/**',
            '**/landing-gita-1972-reprint/**',
            '**/GitaLanding.*/**',
            '**/tests/**',
            '**/test-api.js',
        ],
    },
];
