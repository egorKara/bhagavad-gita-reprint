const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты API
app.use('/api', apiRoutes);

// Экспорт приложения
module.exports = app;
