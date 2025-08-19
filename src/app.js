const express = require('express');
const path = require('path');
const statusRoutes = require('./api/routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты API
app.use('/api', statusRoutes);

// Экспорт приложения
module.exports = app;
