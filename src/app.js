const express = require('express');
const path = require('path');
const cors = require('cors');
const statusRoutes = require('./api/routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// CORS (для фронта на другом домене)
app.use(cors({
    origin: [
        'https://egorkara.github.io',
        'https://gita-1972-reprint.ru',
        'https://www.gita-1972-reprint.ru',
        'https://api.gita-1972-reprint.ru'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false
}));

// Endpoint для проверки состояния сервера (health check)
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Маршруты API
app.use('/api', statusRoutes);

// Экспорт приложения
module.exports = app;
