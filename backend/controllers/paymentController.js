// controllers/paymentController.js
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

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
