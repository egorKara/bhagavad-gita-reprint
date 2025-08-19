const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to avoid breaking existing inline styles
}));

// Compression middleware
app.use(compression());

// Cache control for static assets
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets'), {
    maxAge: '1y', // Cache assets for 1 year
    etag: true,
    lastModified: true
}));

// Serve static files with shorter cache for HTML files
app.use(express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '1h', // Cache HTML files for 1 hour
    etag: true,
    lastModified: true
}));

// Middleware для парсинга JSON
app.use(express.json());

// Маршруты API
app.use('/api', apiRoutes);

// Экспорт приложения
module.exports = app;
