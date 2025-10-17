const router = require('express').Router();
const ctrl = require('../controllers/mockGatewayController');
router.post('/mock-gateway/charge', ctrl.charge);
module.exports = router;
