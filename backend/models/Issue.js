const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, enum: ['collection', 'payment', 'bin', 'sensor', 'other'], required: true, index: true },
  description: { type: String, required: true },
  location: {
    area: { type: String, index: true },
    city: { type: String, index: true },
    address: String
  },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending', index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNotes: String
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);
