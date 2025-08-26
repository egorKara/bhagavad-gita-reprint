const client = require('prom-client');
const { metricsToken } = require('../config');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 3, 5],
});

function metricsMiddleware(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const diffNs = Number(process.hrtime.bigint() - start);
        const diffSec = diffNs / 1e9;
        const route = req.route && req.route.path ? req.route.path : req.path;
        httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(diffSec);
    });
    next();
}

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

async function metricsHandler(_req, res) {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
}

module.exports = { metricsMiddleware, requireMetricsAuth, metricsHandler };
