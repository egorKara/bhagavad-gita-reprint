// ESLint конфигурация для проекта Bhagavad-Gita 1972
// Современный формат ESLint 9.x (flat config)

// import js from '@eslint/js'; // Убрано - не используется
import prettier from 'eslint-config-prettier';
import security from 'eslint-plugin-security';

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

            // Функции
            'function-paren-newline': 'off',
            'max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreComments: true
                }
            ],

            // Объекты и массивы
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'comma-spacing': ['error', { before: false, after: true }],

            // Безопасность DOM
            'no-inner-declarations': 'error',
            'no-irregular-whitespace': 'error'
        }
    },

    // Специальная конфигурация для серверных файлов
    {
        files: ['src/**/*.js', 'scripts/**/*.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                // Node.js окружение
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly'
            }
        },
        rules: {
            'no-console': 'off' // Разрешаем console в серверном коде
        }
    },

    // Специальная конфигурация для клиентских файлов
    {
        files: ['public/**/*.js'],
        languageOptions: {
            sourceType: 'script', // Браузерные скрипты часто не модули
            globals: {
                // Браузерное окружение
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly'
            }
        },
        rules: {
            'no-console': 'warn', // Предупреждение для клиентского кода
            'no-undef': 'error'
        }
    },

    // Конфигурация для тестовых файлов
    {
        files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
        languageOptions: {
            globals: {
                // Тестовые фреймворки
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                test: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly'
            }
        },
        rules: {
            'no-console': 'off' // Разрешаем console в тестах
        }
    },

    // Исключения файлов
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', '.cursor/**', 'coverage/**', '*.min.js']
    },

    // Интеграция с Prettier (должна быть последней)
    prettier
];
