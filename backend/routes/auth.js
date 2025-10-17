const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], validate, authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, authController.login);

// Profile
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, [
  body('name').optional().isString(),
  body('address').optional().isString(),
  body('area').optional().isString(),
  body('userType').optional().isIn(['resident', 'business']),
  body('paymentInfo').optional().isString(),
], validate, authController.updateProfile);

// Admin delete user
router.delete('/:id', auth, role(['admin']), [param('id').isString()], validate, authController.deleteUser);

module.exports = router;
