#!/usr/bin/env node

/**
 * Точка входа в приложение
 */

import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const { port } = config;

// Запуск сервера
const server = app.listen(port, () => {
    logger.info('Server started', { port, url: `http://localhost:${port}` });
    logger.info('API endpoint', { url: `http://localhost:${port}/api/status` });
});

// Обработка сигналов завершения для корректного закрытия сервера
process.on('SIGTERM', () => {
    logger.warn('SIGTERM received. Starting graceful shutdown...');
    server.close(() => {
        logger.info('Server stopped.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.warn('SIGINT received. Starting graceful shutdown...');
    server.close(() => {
        logger.info('Server stopped.');
        process.exit(0);
    });
});
