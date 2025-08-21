const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { randomUUID } = require('crypto');
const client = require('prom-client');
const statusRoutes = require('./api/routes/statusRoutes');
const orderRoutes = require('./api/routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// Security headers
app.use(helmet());

// Request ID
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
});

// Access logs
app.use(morgan(':method :url :status :res[content-length] - :response-time ms id=:req[id]', {
    stream: {
        write: (message) => process.stdout.write(message)
    }
}));

// Basic rate limit for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 1000, // мягкий лимит
    standardHeaders: true,
    legacyHeaders: false,
});

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

// Применяем лимит только к API
app.use('/api', apiLimiter);

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 3, 5]
});

app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const diffNs = Number(process.hrtime.bigint() - start);
        const diffSec = diffNs / 1e9;
        const route = req.route && req.route.path ? req.route.path : req.path;
        httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(diffSec);
    });
    next();
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Endpoint для проверки состояния сервера (health check)
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Маршруты API
app.use('/api/status', statusRoutes);
app.use('/api/orders', orderRoutes);

// Экспорт приложения
module.exports = app;
