// routes/payments.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const authHeader = require('../middleware/authHeader');
const ctrl = require('../controllers/paymentController');

// Allow either JWT auth or x-user-id dev header
router.use(authHeader);

// Mock gateway-style flows
router.post('/checkout', ctrl.checkout);
router.post('/:id/confirm', ctrl.confirm);
router.get('/me', ctrl.getMine);
router.get('/:id', ctrl.getOne);
router.get('/history/me', ctrl.listMyRecords);

// Spec CRUD
router.post('/', ctrl.createPayment);
router.get('/', auth, role(['admin']), ctrl.listPayments);
router.put('/:id', auth, role(['admin','staff']), ctrl.updatePayment);
router.delete('/:id', auth, role(['admin']), ctrl.deletePayment);

// Paybacks and calculations
router.post('/payback', ctrl.createPayback);
router.get('/summary', ctrl.summary);
router.post('/calc', ctrl.calculateCharge);

module.exports = router;
