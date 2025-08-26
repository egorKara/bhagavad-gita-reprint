/**
 * Маршруты для API статуса
 */

import express from 'express';
import statusController from '../controllers/statusController.js';

const router = express.Router();

router.get('/', statusController.getStatus);

export default router;
