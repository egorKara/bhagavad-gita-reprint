const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { randomUUID } = require('crypto');
const { metricsMiddleware, requireMetricsAuth, metricsHandler } = require('./utils/metrics');
const statusRoutes = require('./api/routes/statusRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const translationRoutes = require('./api/routes/translationRoutes');
const { corsOrigins } = require('./config');
const logger = require('./utils/logger');

const app = express();

// Усиление настроек Express
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON (с лимитом)
app.use(express.json({ limit: '100kb' }));

// Security headers
app.use(helmet());

// Request ID
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
});

// Access logs
morgan.token('id', (req) => req.id);
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms id=:id', {
        stream: {
            write: (message) => process.stdout.write(message)
        }
    })
);

// Basic rate limit for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 1000, // мягкий лимит
    standardHeaders: true,
    legacyHeaders: false
});

// Отдельный более строгий лимит на создание заказов
const createOrderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
});

// CORS (для фронта на другом домене)
app.use(
    cors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: false
    })
);

// Применяем лимит только к API
app.use('/api', apiLimiter);
app.use('/api/orders/create', createOrderLimiter);

// Prometheus metrics
app.use(metricsMiddleware);

app.get('/metrics', requireMetricsAuth, metricsHandler);

// Liveness and Readiness endpoints
app.get('/livez', (req, res) => {
    res.status(200).send('ok');
});

app.get('/readyz', async (req, res) => {
    // Add deeper checks here (e.g., DB connectivity) when available
    res.status(200).send('ok');
});

// Endpoint для проверки состояния сервера (health check)
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Маршруты API
app.use('/api/status', statusRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/translate', translationRoutes);

// Централизованный обработчик ошибок
app.use((err, req, res, _next) => {
    logger.error('Unhandled error', {
        message: err && err.message,
        stack: err && err.stack,
        requestId: req.id
    });
    res.status(500).json({ error: 'Internal Server Error', requestId: req.id });
});

// Экспорт приложения
module.exports = app;
