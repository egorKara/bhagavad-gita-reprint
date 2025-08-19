const path = require('path');

// Подключаем dotenv только один раз при импорте конфига
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
};

module.exports = config;


