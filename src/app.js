const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.disable('x-powered-by');

// Безопасность и сжатие
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compression());

// Каталоги статических файлов
const publicDir = path.join(__dirname, '..', 'public');

// Агрессивное кеширование для ассетов (CSS/JS/шрифты/изображения)
app.use('/assets', express.static(path.join(publicDir, 'assets'), {
    maxAge: '30d',
    immutable: true,
    etag: true
}));

// Базовая раздача статики и осторожное кеширование HTML
app.use(express.static(publicDir, {
    setHeaders: (res, servedPath) => {
        if (servedPath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты API
app.use('/api', apiRoutes);

// Экспорт приложения
module.exports = app;
