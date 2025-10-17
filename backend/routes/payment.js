const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
router.get('/payments', ctrl.listMine);
router.get('/payments/:id', ctrl.getById);
module.exports = router;
