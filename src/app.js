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
const translationRoutes = require('./api/routes/translationRoutes');
const { corsOrigins, metricsToken } = require('./config');
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
			write: (message) => process.stdout.write(message),
		},
	})
);

// Basic rate limit for API
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 1000, // мягкий лимит
	standardHeaders: true,
	legacyHeaders: false,
});

// Отдельный более строгий лимит на создание заказов
const createOrderLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
});

// CORS (для фронта на другом домене)
app.use(
	cors({
		origin: corsOrigins,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		credentials: false,
	})
);

// Применяем лимит только к API
app.use('/api', apiLimiter);
app.use('/api/orders/create', createOrderLimiter);

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'route', 'status_code'],
	buckets: [0.05, 0.1, 0.3, 0.5, 1, 3, 5],
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

function requireMetricsAuth(req, res, next) {
	const authHeader = req.headers['authorization'] || '';
	if (!metricsToken) {
		return res
			.status(503)
			.json({ error: 'Metrics are disabled. Set METRICS_TOKEN to enable.' });
	}
	if (authHeader === `Bearer ${metricsToken}`) {
		return next();
	}
	return res.status(401).json({ error: 'Unauthorized' });
}

app.get('/metrics', requireMetricsAuth, async (req, res) => {
	res.set('Content-Type', client.register.contentType);
	res.end(await client.register.metrics());
});

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
	logger.error('Unhandled error', { error: String(err), requestId: req.id });
	res.status(500).json({ error: 'Internal Server Error', requestId: req.id });
});

// Экспорт приложения
module.exports = app;
