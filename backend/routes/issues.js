const router = require('express').Router();
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const c = require('../controllers/issueController');

// Create issue (resident/business)
router.post('/', auth, [
  body('category').isIn(['collection', 'payment', 'bin', 'sensor', 'other']),
  body('description').isString().trim().isLength({ min: 5 }),
  body('location').optional().isObject(),
  body('location.area').optional().isString(),
  body('location.city').optional().isString(),
  body('location.address').optional().isString(),
], validate, c.create);

// Get all issues (admin/staff)
router.get('/', auth, role(['staff', 'admin']), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['Pending', 'In Progress', 'Resolved']),
  query('category').optional().isIn(['collection', 'payment', 'bin', 'sensor', 'other']),
  query('city').optional().isString(),
  query('q').optional().isString(),
], validate, c.listAll);

// Get my issues
router.get('/my', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['Pending', 'In Progress', 'Resolved']),
], validate, c.listMine);

// Get single issue
router.get('/:id', auth, [param('id').isString()], validate, c.getOne);

// Update (staff/admin)
router.put('/:id', auth, role(['staff', 'admin']), [
  param('id').isString(),
  body('status').optional().isIn(['Pending', 'In Progress', 'Resolved']),
  body('assignedTo').optional().isString(),
  body('resolutionNotes').optional().isString(),
], validate, c.update);

// Delete (admin)
router.delete('/:id', auth, role(['admin']), [param('id').isString()], validate, c.remove);

module.exports = router;
