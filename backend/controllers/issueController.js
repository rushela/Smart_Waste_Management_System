const { Types } = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
const notify = require('../services/notificationService');

const asId = (v) => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : null);

// Create a new issue (resident/business)
exports.create = async (req, res, next) => {
  try {
    const uid = req.user?._id || req.user?.id; // middleware/auth sets full user, authHeader sets id
    const userId = asId(uid);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { category, description, location } = req.body;
    const issue = await Issue.create({
      userId,
      category,
      description,
      location: {
        area: location?.area || req.user?.area || '',
        city: location?.city || req.user?.city || '',
        address: location?.address || ''
      }
    });
    // notify user
    notify.sendIssueCreated(req.user, issue).catch(() => {});
    return res.status(201).json({ success: true, issue });
  } catch (err) { next(err); }
};

// Get all issues (admin/staff)
exports.listAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category, city, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (city) filter['location.city'] = city;
    if (q) filter.$or = [
      { description: { $regex: q, $options: 'i' } },
      { 'location.area': { $regex: q, $options: 'i' } },
      { 'location.city': { $regex: q, $options: 'i' } }
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Math.min(Number(limit), 100)).populate('userId', 'name email role').populate('assignedTo', 'name email role'),
      Issue.countDocuments(filter)
    ]);
    return res.json({ total, page: Number(page), limit: Number(limit), data: items });
  } catch (err) { next(err); }
};

// Get my issues (resident/business)
exports.listMine = async (req, res, next) => {
  try {
    const uid = req.user?._id || req.user?.id; const userId = asId(uid);
    const { page = 1, limit = 20, status } = req.query;
    const filter = { userId };
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Math.min(Number(limit), 100)),
      Issue.countDocuments(filter)
    ]);
    return res.json({ total, page: Number(page), limit: Number(limit), data: items });
  } catch (err) { next(err); }
};

// Get single issue
exports.getOne = async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid id' });
    const issue = await Issue.findById(id).populate('userId', 'name email').populate('assignedTo', 'name email');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    // permit owner or staff/admin
    if (!['staff', 'admin'].includes(req.user?.role) && String(issue.userId._id || issue.userId) !== String(req.user?._id || req.user?.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.json({ issue });
  } catch (err) { next(err); }
};

// Update issue (status/assign/notes) staff/admin
exports.update = async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid id' });
    const { status, assignedTo, resolutionNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (resolutionNotes !== undefined) update.resolutionNotes = resolutionNotes;
    if (assignedTo) {
      const staff = await User.findById(assignedTo);
      if (!staff || !['staff', 'admin'].includes(staff.role)) return res.status(400).json({ message: 'assignedTo must be staff/admin' });
      update.assignedTo = staff._id;
    }
    const issue = await Issue.findByIdAndUpdate(id, update, { new: true });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    notify.sendIssueUpdated(req.user, issue).catch(() => {});
    return res.json({ success: true, issue });
  } catch (err) { next(err); }
};

// Delete issue (admin)
exports.remove = async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid id' });
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    return res.json({ success: true });
  } catch (err) { next(err); }
};
