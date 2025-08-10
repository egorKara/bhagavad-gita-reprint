#!/usr/bin/env node

/**
 * Точка входа в приложение
 */

const app = require('./app');
const PORT = process.env.PORT || 3000;

// Запуск сервера
const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Фронтенд доступен по адресу: http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/status`);
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
