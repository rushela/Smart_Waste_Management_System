const router = require('express').Router();
const ctrl = require('../controllers/creditController');
router.get('/credit', ctrl.getMyCredit);
module.exports = router;
