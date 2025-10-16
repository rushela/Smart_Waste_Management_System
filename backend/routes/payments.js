// routes/payments.js
const router = require('express').Router();
const auth = require('../middleware/auth');         // your real auth (if ready)
const authHeader = require('../middleware/authHeader'); // fallback x-user-id
const ctrl = require('../controllers/paymentController');

// Either: only real auth → router.use(auth)
// Or stack both so dev can use x-user-id:
router.use(authHeader);

router.post('/checkout', ctrl.checkout);     // POST body: { amount, currency?, period?, serviceType? }
router.post('/:id/confirm', ctrl.confirm);   // POST body: { status: 'PAID' | 'FAILED', gatewayRef? }
router.get('/me', ctrl.getMine);             // list my payments
router.get('/:id', ctrl.getOne);             // one payment
router.put('/:id', ctrl.update);             // update payment (notes, allocations)
router.post('/:id/void', ctrl.void);         // void a payment

module.exports = router;
