/**
 * Маршруты для API переводов
 */

import express from 'express';
import translationController from '../controllers/translationController.js';

const router = express.Router();

router.post('/translate', translationController.translateText);

export default router;
