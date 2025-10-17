const router = require('express').Router();
const ctrl = require('../controllers/invoiceController');
router.get('/invoices/open', ctrl.listOpen);
module.exports = router;
