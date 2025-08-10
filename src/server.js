const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Обслуживание статических файлов из корня проекта (где находятся index.html, about.html и т.д.)
// Предполагается, что фронтенд-файлы находятся в корне проекта, а не в src/public
app.use(express.static(path.join(__dirname, '..')));

// Маршрут для API (пример)
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Сервер работает корректно',
        timestamp: new Date().toISOString()
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Фронтенд доступен по адресу: http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/status`);
});
