// controllers/paymentController.js
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const paymentService = require('../services/payments/paymentService');

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

    const { amount, currency = 'LKR', period, serviceType = 'WASTE_COLLECTION', allocations } = req.body || {};
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'amount must be a positive number' });
    }

    const payload = {
      user: userId,
      amount,
      currency,
      status: 'PENDING',
      serviceType,
      period,
      gateway: 'MOCK',
    };
    if (Array.isArray(allocations)) payload.allocations = allocations;

    const payment = await paymentService.createPayment(payload);

    // mock gateway session metadata
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

    try {
      const p = await paymentService.confirmPayment(paymentId, userId, status, gatewayRef);
      return res.json({ paymentId: p._id, status: p.status, gatewayRef: p.gatewayRef, paidAt: p.paidAt });
    } catch (e) {
      if (String(e.message).toLowerCase().includes('forbidden')) return res.status(403).json({ message: 'Forbidden' });
      if (String(e.message).toLowerCase().includes('not found')) return res.status(404).json({ message: 'Payment not found' });
      throw e;
    }
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
    const { items, total } = await paymentService.listByUser(userId, { status, limit, offset });

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
        paidAt: p.paidAt,
        allocations: p.allocations || [],
        voided: !!p.voided
      }))
    });
  } catch (err) {
    console.error('getMine error', err);
    return res.status(500).json({ message: 'Failed to list payments' });
  }
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

    const p = await paymentService.findById(paymentId);
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
        allocations: p.allocations || [],
        voided: !!p.voided,
        createdAt: p.createdAt,
        paidAt: p.paidAt
      }
    });
  } catch (err) {
    console.error('getOne error', err);
    return res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

// PUT /payments/:id - update editable fields such as notes, allocations
exports.update = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });
    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) return res.status(400).json({ message: 'Invalid payment id' });

    const allowed = ['notes', 'allocations', 'remarks'];
    const updates = {};
    allowed.forEach(k => { if (k in req.body) updates[k] = req.body[k]; });

    const updated = await paymentService.updatePayment(paymentId, userId, updates);
    if (!updated) return res.status(404).json({ message: 'Payment not found' });
    return res.json({ paymentId: updated._id, status: updated.status, allocations: updated.allocations || [] });
  } catch (err) {
    console.error('payment update error', err);
    if (String(err.message).toLowerCase().includes('forbidden')) return res.status(403).json({ message: 'Forbidden' });
    return res.status(500).json({ message: 'Failed to update payment' });
  }
};

// POST /payments/:id/void - mark payment voided
exports.void = async (req, res) => {
  try {
    const userId = asObjectId(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'Invalid user id' });
    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) return res.status(400).json({ message: 'Invalid payment id' });
    const { reason } = req.body || {};
    const p = await paymentService.voidPayment(paymentId, userId, reason);
    return res.json({ paymentId: p._id, voided: !!p.voided, voidedAt: p.voidedAt });
  } catch (err) {
    console.error('void payment error', err);
    if (String(err.message).toLowerCase().includes('forbidden')) return res.status(403).json({ message: 'Forbidden' });
    return res.status(500).json({ message: 'Failed to void payment' });
  }
};
