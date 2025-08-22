const path = require('path');

// Подключаем dotenv только один раз при импорте конфига
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const config = {
    // Основные настройки
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    
    // Настройки безопасности
    cors: {
        origins: [
            'https://egorkara.github.io',
            'https://gita-1972-reprint.ru',
            'https://www.gita-1972-reprint.ru',
            'https://api.gita-1972-reprint.ru'
        ],
        credentials: false
    },
    
    // Настройки rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 минут
        max: Number(process.env.RATE_LIMIT_MAX) || 1000
    },
    
    // Настройки логирования
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    },
    
    // Настройки мониторинга
    monitoring: {
        prometheus: {
            enabled: process.env.PROMETHEUS_ENABLED !== 'false',
            port: Number(process.env.PROMETHEUS_PORT) || 9090
        }
    },
    
    // Настройки данных
    data: {
        storage: process.env.STORAGE_TYPE || 'file', // file, database
        path: process.env.DATA_PATH || path.join(process.cwd(), 'data')
    },
    
    // Настройки бизнес-логики
    business: {
        bookPrice: Number(process.env.BOOK_PRICE) || 1500,
        deliveryPrice: Number(process.env.DELIVERY_PRICE) || 300,
        maxQuantity: Number(process.env.MAX_QUANTITY) || 100
    }
};

module.exports = config;


