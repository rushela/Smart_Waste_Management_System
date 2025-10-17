// controllers/paymentController.js
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const PaymentRecord = require('../models/PaymentRecord');
const PricingModel = require('../models/PricingModel');
const { charge } = require('../services/payments/mockPaymentGateway');
const User = require('../models/User');

const asObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

// POST /payments/checkout
// body: { amount, currency?, period?, serviceType? }
exports.checkout = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id (must be Mongo ObjectId)' });

    const { amount, currency = 'LKR', period, serviceType = 'WASTE_COLLECTION' } = req.body || {};
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'amount must be a positive number' });
    }

    // Create payment intent (status=PENDING)
    const payment = await Payment.create({
      user: userId,
      amount,
      currency,
      status: 'PENDING',
      serviceType,
      period,
      gateway: 'MOCK'
    });

    // (Optional) Mock gateway session metadata for your UI
    const gwSessionId = `mock_${payment._id.toString()}`;
    const redirectUrl = `https://mock-gateway.local/checkout/${gwSessionId}`;

    return res.status(201).json({
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        serviceType: payment.serviceType,
        period: payment.period,
        createdAt: payment.createdAt,
        gateway: { name: payment.gateway, sessionId: gwSessionId, redirectUrl }
      }
    });
  } catch (err) {
    console.error('checkout error', err);
    return res.status(500).json({ message: 'Failed to create payment' });
  }
};

// POST /payments/:id/confirm
// body: { status: 'PAID' | 'FAILED', gatewayRef? }
exports.confirm = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });

    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: 'Invalid payment id' });
    }

    const { status, gatewayRef } = req.body || {};
    if (!['PAID', 'FAILED'].includes(status)) {
      return res.status(400).json({ message: "status must be 'PAID' or 'FAILED'" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (String(payment.user) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Idempotency: if already finalized, return current state
    if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.status)) {
      return res.json({ paymentId: payment._id, status: payment.status, gatewayRef: payment.gatewayRef });
    }

    payment.status = status;
    if (status === 'PAID') payment.paidAt = new Date();
    if (gatewayRef) payment.gatewayRef = gatewayRef;

    try {
      await payment.save();
    } catch (e) {
      // Handle duplicate gatewayRef (unique index)
      if (e?.code === 11000 && e?.keyPattern?.gatewayRef) {
        return res.status(409).json({ message: 'gatewayRef already used', field: 'gatewayRef' });
      }
      throw e;
    }

    // TODO: issue receipt, send email, apply rebate, etc.
    // On paid, record a PaymentRecord for analytics
    if (status === 'PAID') {
      await PaymentRecord.create({
        userId,
        amount: payment.amount,
        date: new Date(),
        method: 'mock_gateway',
        type: 'payment',
        status: 'completed',
        paymentType: 'collection_fee',
        billingModel: null,
        city: req.user?.city || undefined,
        transactionId: gatewayRef || undefined,
      });
      // Decrease user's accountBalance by paid amount
      await User.findByIdAndUpdate(userId, { $inc: { accountBalance: -Math.abs(payment.amount) } });
    }
    return res.json({ paymentId: payment._id, status: payment.status, gatewayRef: payment.gatewayRef, paidAt: payment.paidAt });
  } catch (err) {
    console.error('confirm error', err);
    return res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// GET /payments/me?status=PAID&limit=20&offset=0
exports.getMine = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });

    const { status, limit = 20, offset = 0 } = req.query;
    const q = { user: userId };
    if (status) q.status = status;

    const [items, total] = await Promise.all([
      Payment.find(q).sort({ createdAt: -1 }).skip(Number(offset)).limit(Math.min(Number(limit), 100)),
      Payment.countDocuments(q)
    ]);

    return res.json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      payments: items.map(p => ({
        id: p._id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        period: p.period,
        serviceType: p.serviceType,
        gatewayRef: p.gatewayRef,
        createdAt: p.createdAt,
        paidAt: p.paidAt
      }))
    });
  } catch (err) {
    console.error('getMine error', err);
    return res.status(500).json({ message: 'Failed to list payments' });
  }
};

// POST /api/payments -> Create new payment record directly via mock gateway
// body: { userId?, amount, method?, city?, paymentType?, billingModel? }
exports.createPayment = async (req, res) => {
  try {
    const uid = req.body.userId || req.user?.id;
    const userId = asObjectId(uid);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });

    const { amount, method = 'mock_gateway', city, paymentType = 'collection_fee', billingModel = null } = req.body;
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ message: 'amount must be > 0' });

    // Ensure user exists (create if needed for dev mode)
    let user = await User.findById(userId);
    if (!user) {
      user = await User.create({
        _id: userId,
        name: 'Guest User',
        email: `user-${userId}@example.com`,
        password: 'temp',
        role: 'resident',
        accountBalance: 0
      });
    }

    const gw = await charge({ amount, method });
    const status = gw.status === 'completed' ? 'completed' : 'failed';
    const rec = await PaymentRecord.create({
      userId,
      amount,
      date: new Date(),
      method,
      type: paymentType === 'recyclable_payback' ? 'payback' : 'payment',
      status,
      paymentType,
      billingModel,
      city,
      transactionId: gw.transactionId,
    });
    // Adjust account balance: payments reduce balance, paybacks increase (negative amount in record)
    const delta = paymentType === 'recyclable_payback' ? Math.abs(amount) : -Math.abs(amount);
    await User.findByIdAndUpdate(userId, { $inc: { accountBalance: delta } });
    res.status(201).json({ status: gw.status, transactionId: gw.transactionId, record: rec });
  } catch (e) {
    console.error('createPayment error', e);
    res.status(500).json({ message: 'Failed to create payment' });
  }
};

// GET /api/payments (admin only - enforced in routes)
exports.listPayments = async (req, res) => {
  const { userId, city, status, type, limit = 50, offset = 0 } = req.query;
  const q = {};
  if (userId && mongoose.Types.ObjectId.isValid(userId)) q.userId = new mongoose.Types.ObjectId(userId);
  if (city) q.city = city;
  if (status) q.status = status;
  if (type) q.type = type;
  const [items, total] = await Promise.all([
    PaymentRecord.find(q).sort({ date: -1 }).skip(Number(offset)).limit(Math.min(Number(limit), 200)),
    PaymentRecord.countDocuments(q)
  ]);
  res.json({ total, items });
};

// GET /api/payments/:id -> find PaymentRecord by id
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const doc = await PaymentRecord.findById(id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

// PUT /api/payments/:id -> Admin/Staff update status or remarks
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const updates = {};
  if (req.body.status) updates.status = req.body.status;
  if (req.body.remarks) updates.remarks = req.body.remarks;
  const doc = await PaymentRecord.findByIdAndUpdate(id, updates, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

// DELETE /api/payments/:id
exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const r = await PaymentRecord.findByIdAndDelete(id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
};

// GET /api/payments/history -> list current user's PaymentRecord (payments + paybacks)
exports.listMyRecords = async (req, res) => {
  try {
    const rawUserId = req.user?.id;
    if (!rawUserId) {
      return res.json({ total: 0, items: [] });
    }
    
    // Try to convert to ObjectId, but if it fails, just use the raw ID
    let userId = asObjectId(rawUserId);
    if (!userId) {
      // If not a valid ObjectId format, return empty (user doesn't exist yet)
      return res.json({ total: 0, items: [] });
    }
    
    const { limit = 50, offset = 0 } = req.query;
    const [items, total] = await Promise.all([
      PaymentRecord.find({ userId }).sort({ date: -1 }).skip(Number(offset)).limit(Math.min(Number(limit), 200)),
      PaymentRecord.countDocuments({ userId })
    ]);
    res.json({ total, items });
  } catch (e) {
    console.error('listMyRecords error', e);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// POST /api/payments/payback -> calculate and record payback for recyclables
// body: { userId?, city, items: [{ name, weight } ...] }
exports.createPayback = async (req, res) => {
  try {
    const uid = req.body.userId || req.user?.id;
    const userId = asObjectId(uid);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });
    const { city, items = [] } = req.body || {};
    if (!city) return res.status(400).json({ message: 'city is required' });
    const pricing = await PricingModel.findOne({ city });
    if (!pricing) {
      // Create default pricing model if doesn't exist
      const defaultPricing = await PricingModel.create({
        city,
        modelType: 'flat_fee',
        flatFeeAmount: 30,
        ratePerKg: 2.5,
        recyclablePaybackRates: {
          plastic: 0.2,
          eWaste: 1.5,
          metal: 0.5,
          paper: 0.1,
          glass: 0.15
        }
      });
      return res.status(404).json({ message: `No pricing model for ${city}. Default model created. Please try again.` });
    }

    // Ensure user exists (create if needed for dev mode)
    let user = await User.findById(userId);
    if (!user) {
      user = await User.create({
        _id: userId,
        name: 'Guest User',
        email: `user-${userId}@example.com`,
        password: 'temp',
        role: 'resident',
        accountBalance: 0
      });
    }

    let totalPayback = 0;
    const rates = pricing.recyclablePaybackRates || {};
    for (const it of items) {
      const rateKey = it.name === 'e-waste' ? 'eWaste' : (it.name || '').toLowerCase();
      const rate = rates[rateKey] || 0;
      totalPayback += (Number(it.weight) || 0) * rate;
    }
    totalPayback = Math.round(totalPayback * 100) / 100;

    // record as negative flow for analytics
    const rec = await PaymentRecord.create({
      userId,
      amount: -Math.abs(totalPayback),
      date: new Date(),
      method: 'mock_gateway',
      type: 'payback',
      status: 'completed',
      paymentType: 'recyclable_payback',
      billingModel: null,
      city,
      transactionId: `PBK_${Date.now()}`
    });
    // Increase user's account balance by payback amount
    await User.findByIdAndUpdate(userId, { $inc: { accountBalance: Math.abs(totalPayback) } });
    res.status(201).json({ amount: totalPayback, record: rec });
  } catch (e) {
    console.error('createPayback error', e);
    res.status(500).json({ message: 'Failed to create payback' });
  }
};

// GET /api/payments/summary -> totals for income, paybacks, outstanding for current user
exports.summary = async (req, res) => {
  try {
    const rawUserId = req.user?.id;
    if (!rawUserId) {
      return res.json({ totals: [], outstanding: 0 });
    }
    
    const userId = asObjectId(rawUserId);
    if (!userId) {
      return res.json({ totals: [], outstanding: 0 });
    }
    
    const match = { userId };
    if (req.query.city) match.city = req.query.city;
    
    const totals = await PaymentRecord.aggregate([
      { $match: match },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
      { $project: { _id: 0, type: '$_id', total: 1 } }
    ]);
    
    const outstandingAgg = await PaymentRecord.aggregate([
      { $match: { ...match, status: 'pending' } },
      { $group: { _id: null, totalOutstanding: { $sum: '$amount' } } },
      { $project: { _id: 0, totalOutstanding: 1 } }
    ]);
    
    res.json({
      totals,
      outstanding: outstandingAgg[0]?.totalOutstanding || 0
    });
  } catch (e) {
    console.error('summary error', e);
    res.status(500).json({ message: 'Failed to get summary' });
  }
};

// POST /api/payments/calc -> calculate charge by pricing model
// body: { city, modelType, weight? }
exports.calculateCharge = async (req, res) => {
  const { city, modelType, weight = 0 } = req.body || {};
  if (!city || !modelType) return res.status(400).json({ message: 'city and modelType are required' });
  const p = await PricingModel.findOne({ city });
  if (!p) return res.status(404).json({ message: 'No pricing model for city' });
  let total = 0;
  if (modelType === 'weight_based') total = (Number(weight) || 0) * (p.ratePerKg || 0);
  else total = p.flatFeeAmount || 0;
  total = Math.round(total * 100) / 100;
  res.json({ total });
};

// GET /payments/:id
exports.getOne = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });

    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: 'Invalid payment id' });
    }

    const p = await Payment.findById(paymentId);
    if (!p) return res.status(404).json({ message: 'Payment not found' });
    if (String(p.user) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    return res.json({
      payment: {
        id: p._id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        serviceType: p.serviceType,
        period: p.period,
        gateway: p.gateway,
        gatewayRef: p.gatewayRef,
        receiptUrl: p.receiptUrl,
        emailSent: p.emailSent,
        createdAt: p.createdAt,
        paidAt: p.paidAt
      }
    });
  } catch (err) {
    console.error('getOne error', err);
    return res.status(500).json({ message: 'Failed to fetch payment' });
  }
};
