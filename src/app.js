const express = require('express');
const path = require('path');
const compression = require('compression');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Сжатие ответов
app.use(compression({ threshold: 1024 }));

// Кэширование и обслуживание статических файлов
app.use(
    express.static(path.join(__dirname, '..', 'public'), {
        etag: true,
        maxAge: '1d',
        setHeaders: (res, filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.html') {
                res.setHeader('Cache-Control', 'no-cache');
            } else if (/(?:\.js|\.css|\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp|\.avif|\.ico|\.woff2?|\.ttf|\.otf)$/i.test(filePath)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
        }
    })
);

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты API
app.use('/api', apiRoutes);

// Экспорт приложения
module.exports = app;
