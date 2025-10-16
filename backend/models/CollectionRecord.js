const mongoose = require('mongoose');

const CollectionRecordSchema = new mongoose.Schema({
  binId: { type: String, required: true, index: true },
  area: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  time: { type: String }, // HH:mm if needed
  weight: { type: Number, required: true },
  wasteType: { type: String, enum: ['recyclable', 'organic', 'general', 'hazardous', 'other'], required: true },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  truckId: { type: String },
  routeId: { type: String },
  distanceKm: { type: Number, default: 0 },
  stops: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-update hook: could invalidate caches or trigger async analytics updates
CollectionRecordSchema.post('save', function(doc) {
  // For demo we just log; a job/queue could be triggered here
  // console.log('New CollectionRecord saved', doc._id);
});

module.exports = mongoose.model('CollectionRecord', CollectionRecordSchema);
