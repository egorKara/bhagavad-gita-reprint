const path = require('path');

// Подключаем dotenv только один раз при импорте конфига
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const defaultCorsOrigins = [
    'https://egorkara.github.io',
    'https://gita-1972-reprint.ru',
    'https://www.gita-1972-reprint.ru',
    'https://api.gita-1972-reprint.ru'
];

const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    corsOrigins: corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins,
    adminToken: process.env.ADMIN_TOKEN || null,
    metricsToken: process.env.METRICS_TOKEN || null,
};

module.exports = config;


