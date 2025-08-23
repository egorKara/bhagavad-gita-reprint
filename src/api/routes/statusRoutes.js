const express = require('express');
const { getStatus, getSystemInfo, getSecurityStatus, getNginxStats } = require('../controllers/statusController');
const { requireAdminAuth } = require('../../middleware/auth');
const router = express.Router();

// Определение маршрутов
router.get('/', getStatus);
router.get('/system-info', requireAdminAuth, getSystemInfo);
router.get('/security-status', requireAdminAuth, getSecurityStatus);
router.get('/nginx-stats', requireAdminAuth, getNginxStats);

module.exports = router;
