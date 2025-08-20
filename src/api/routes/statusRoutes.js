const express = require('express');
const { getStatus, getSystemInfo, getSecurityStatus, getNginxStats } = require('../controllers/statusController');
const router = express.Router();

// Определение маршрутов
router.get('/status', getStatus);
router.get('/system-info', getSystemInfo);
router.get('/security-status', getSecurityStatus);
router.get('/nginx-stats', getNginxStats);

module.exports = router;


