const PricingModel = require('../models/PricingModel');

exports.list = async (req, res, next) => {
  try {
    const items = await PricingModel.find({}).sort({ city: 1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { city, modelType, ratePerKg, flatFeeAmount, recyclablePaybackRates } = req.body;
    if (!city || !modelType) return res.status(400).json({ message: 'city and modelType are required' });
    const created = await PricingModel.create({ city, modelType, ratePerKg, flatFeeAmount, recyclablePaybackRates });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body, lastUpdated: new Date() };
    const doc = await PricingModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const r = await PricingModel.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
