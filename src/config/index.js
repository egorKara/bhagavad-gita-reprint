const path = require('path');

// Подключаем dotenv только один раз при импорте конфига
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const defaultCorsOrigins = [
    'https://egorkara.github.io',
    'https://gita-1972-reprint.ru',
    'https://www.gita-1972-reprint.ru',
    'https://api.gita-1972-reprint.ru',
];

const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function resolveDataDir() {
    const fromEnv = process.env.DATA_DIR;
    if (!fromEnv) return path.resolve(process.cwd(), 'data');
    return path.isAbsolute(fromEnv) ? fromEnv : path.resolve(process.cwd(), fromEnv);
}

const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    corsOrigins: corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins,
    adminToken: process.env.ADMIN_TOKEN || null,
    metricsToken: process.env.METRICS_TOKEN || null,
    recaptchaSecret: process.env.RECAPTCHA_SECRET || null,
    turnstileSecret: process.env.TURNSTILE_SECRET || null,
    dataDir: resolveDataDir(),
    translator: {
        provider: process.env.TRANSLATOR_PROVIDER || 'none',
        apiKey:
            process.env.TRANSLATOR_API_KEY ||
            process.env.GOOGLE_TRANSLATE_KEY ||
            process.env.DEEPL_API_KEY ||
            process.env.YANDEX_API_KEY ||
            null,
        endpoint: process.env.TRANSLATOR_ENDPOINT || null,
    },
    logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
};

module.exports = config;
