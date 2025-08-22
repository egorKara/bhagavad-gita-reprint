const express = require('express');
const {
    getStatus,
    getSystemInfo,
    getSecurityStatus,
    getNginxStats,
} = require('../controllers/statusController');
const { adminToken } = require('../../config');
const router = express.Router();

function requireAdminAuth(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    if (adminToken && authHeader === `Bearer ${adminToken}`) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
}

// Определение маршрутов
router.get('/', getStatus);
router.get('/system-info', requireAdminAuth, getSystemInfo);
router.get('/security-status', requireAdminAuth, getSecurityStatus);
router.get('/nginx-stats', requireAdminAuth, getNginxStats);

module.exports = router;
