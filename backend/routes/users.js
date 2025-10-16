const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const userController = require('../controllers/userController');

const router = express.Router();

// Resident profile
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, [
  body('name').optional().notEmpty(),
  body('address').optional().notEmpty(),
], validate, userController.updateProfile);

// Staff info
router.get('/staff/me', auth, role(['staff']), userController.getStaffInfo);
router.put('/staff/me/status', auth, role(['staff']), [
  body('collectionStatus').notEmpty(),
], validate, userController.updateCollectionStatus);

// Admin user management
router.get('/', auth, role(['admin']), userController.listUsers);
router.get('/:id', auth, role(['admin']), userController.getUser);
router.post('/', auth, role(['admin']), [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], validate, userController.createUser);
router.put('/:id', auth, role(['admin']), validate, userController.updateUser);
router.delete('/:id', auth, role(['admin']), userController.deleteUser);

module.exports = router;
