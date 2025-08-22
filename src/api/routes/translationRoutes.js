const express = require('express');
const router = express.Router();
const controller = require('../controllers/translationController');

router.post('/batch', controller.batchTranslate);
router.get('/status/:jobId', controller.jobStatus);
router.post('/feedback', controller.submitFeedback);
router.post('/prewarm', controller.prewarmSite);

module.exports = router;