const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/pricingController');

// Public list to allow clients to choose model by city
router.get('/', ctrl.list);

// Admin-only modifications
router.post('/', auth, role(['admin']), ctrl.create);
router.put('/:id', auth, role(['admin']), ctrl.update);
router.delete('/:id', auth, role(['admin']), ctrl.remove);

module.exports = router;
