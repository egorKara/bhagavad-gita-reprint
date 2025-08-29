#!/usr/bin/env node

/**
 * Cursor IDE Agent Bridge
 * Локальный мост для подключения удалённого Yandex Server Agent к Cursor IDE
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const REMOTE_AGENT_URL = 'http://46.21.247.218:3001/agent';
const LOCAL_PORT = 8080;

// Создаём локальный HTTP сервер
const server = http.createServer(async (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Проксируем запрос к удалённому агенту
        const targetUrl = new URL(req.url, REMOTE_AGENT_URL);

        const options = {
            method: req.method,
            headers: {
                ...req.headers,
                host: targetUrl.host,
            },
        };

        const proxyReq = http.request(targetUrl, options, proxyRes => {
            // Копируем заголовки ответа
            res.writeHead(proxyRes.statusCode, proxyRes.headers);

            // Передаём данные
            proxyRes.pipe(res);
        });

        proxyReq.on('error', err => {
            console.error('Proxy error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    error: 'Agent connection failed',
                    details: err.message,
                    remoteUrl: REMOTE_AGENT_URL,
                })
            );
        });

        // Передаём данные запроса
        req.pipe(proxyReq);
    } catch (err) {
        console.error('Request error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                error: 'Internal server error',
                details: err.message,
            })
        );
    }
});

server.listen(LOCAL_PORT, 'localhost', () => {
    console.log(`🌉 Cursor Agent Bridge запущен на http://localhost:${LOCAL_PORT}`);
    console.log(`🔗 Проксирует запросы к: ${REMOTE_AGENT_URL}`);
    console.log(`📝 Для Cursor IDE используйте URL: http://localhost:${LOCAL_PORT}`);
});

server.on('error', err => {
    console.error('Server error:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Остановка Cursor Agent Bridge...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});
