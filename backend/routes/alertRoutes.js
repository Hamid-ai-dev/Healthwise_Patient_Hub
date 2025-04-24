const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertControllers');

router.post('/contact', alertController.createContactAlert);
router.get('/', alertController.getAllAlerts);

module.exports = router;