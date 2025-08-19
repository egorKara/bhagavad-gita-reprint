const express = require('express');
const { getStatus } = require('../controllers/statusController');
const router = express.Router();

// Определение маршрутов
router.get('/status', getStatus);

module.exports = router;


