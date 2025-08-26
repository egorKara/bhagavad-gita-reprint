// ESLint конфигурация для проекта Bhagavad-Gita 1972
// Современный формат ESLint 9.x (flat config)

import prettier from 'eslint-config-prettier';
import security from 'eslint-plugin-security';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    // Базовая конфигурация для всех JS файлов
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                // Браузерные глобальные переменные
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                navigator: 'readonly',
                location: 'readonly',
                history: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',

                // Node.js глобальные (для серверных файлов)
                process: 'readonly',
                global: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly'
            }
        },
        plugins: {
            security
        },
        rules: {
            // ===== ПРАВИЛА БЕЗОПАСНОСТИ =====
            ...security.configs.recommended.rules,

            // ===== БАЗОВЫЕ ПРАВИЛА КАЧЕСТВА КОДА =====

            // Обязательные правила безопасности
            'no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true
                }
            ],
            'no-undef': 'error',
            'no-console': 'warn', // Предупреждение, не ошибка
            'no-debugger': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',

            // Стиль кода (совместимо с Prettier)
            indent: 'off', // Prettier управляет отступами
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',

            // Лучшие практики
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-arrow-callback': 'error',
            'arrow-spacing': 'error',
            'no-duplicate-imports': 'error',

            // Именование (kebab-case для файлов, camelCase для переменных)
            camelcase: [
                'error',
                {
                    properties: 'always',
                    ignoreDestructuring: false
                }
            ],

            // ===== ПРАВИЛА ДЛЯ ES MODULES =====
            'import/no-commonjs': 'error',
            'import/no-amd': 'error',
            'import/no-umd': 'error',
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    ts: 'never'
                }
            ]
        }
    },

    // Конфигурация для TypeScript файлов
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                // Node.js глобальные
                process: 'readonly',
                global: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': typescript,
            security
        },
        rules: {
            ...security.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/prefer-const': 'error',
            '@typescript-eslint/no-var-requires': 'error'
        }
    },

    // Конфигурация для HTML файлов
    {
        files: ['**/*.html'],
        languageOptions: {
            globals: {
                // HTML специфичные глобальные
                HTMLElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLInputElement: 'readonly'
            }
        }
    },

    // Конфигурация для конфигурационных файлов
    {
        files: ['*.config.js', '*.config.ts', '*.config.mjs'],
        rules: {
            'no-console': 'off',
            'import/no-commonjs': 'off'
        }
    },

    // Игнорируем node_modules и dist
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
    },

    // Prettier конфигурация (должна быть последней)
    prettier
];
