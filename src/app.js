const express = require('express');
const path = require('path');
const statusRoutes = require('./api/routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// Endpoint для проверки состояния сервера (health check)
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Маршруты API
app.use('/api', statusRoutes);

// Экспорт приложения
module.exports = app;
