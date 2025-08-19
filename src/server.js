#!/usr/bin/env node

/**
 * Точка входа в приложение
 */

const app = require('./app');
const { port } = require('./config');

// Запуск сервера
const server = app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`Фронтенд доступен по адресу: http://localhost:${port}`);
    console.log(`API endpoint: http://localhost:${port}/api/status`);
});

// Обработка сигналов завершения для корректного закрытия сервера
process.on('SIGTERM', () => {
    console.log('SIGTERM получен. Начало graceful shutdown...');
    server.close(() => {
        console.log('Сервер остановлен.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT получен. Начало graceful shutdown...');
    server.close(() => {
        console.log('Сервер остановлен.');
        process.exit(0);
    });
});
