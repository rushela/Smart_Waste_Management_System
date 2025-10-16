const mongoose = require('mongoose');
const Payment = require('../../models/Payment');

// Minimal service to encapsulate DB operations and transactions
async function createPayment(payload) {
  const doc = new Payment(payload);
  return doc.save();
}

async function findById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Payment.findById(id);
}

async function listByUser(userId, { status, limit = 50, offset = 0 } = {}) {
  const q = { user: userId };
  if (status) q.status = status;
  const [items, total] = await Promise.all([
    Payment.find(q).sort({ createdAt: -1 }).skip(Number(offset)).limit(Math.min(Number(limit), 200)),
    Payment.countDocuments(q)
  ]);
  return { items, total };
}

async function updatePayment(id, userId, updates) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid payment id');
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const p = await Payment.findById(id).session(session);
    if (!p) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }
    if (String(p.user) !== String(userId)) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Forbidden');
    }
    Object.keys(updates).forEach(k => {
      p[k] = updates[k];
    });
    await p.save({ session });
    await session.commitTransaction();
    session.endSession();
    return p;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function confirmPayment(id, userId, status, gatewayRef) {
  // ensure atomic update
  if (!['PAID', 'FAILED'].includes(status)) throw new Error('Invalid status');
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const p = await Payment.findById(id).session(session);
    if (!p) throw new Error('Payment not found');
    if (String(p.user) !== String(userId)) throw new Error('Forbidden');

    if (['PAID','FAILED','CANCELLED'].includes(p.status)) {
      await session.commitTransaction();
      session.endSession();
      return p;
    }

    p.status = status;
    if (status === 'PAID') p.paidAt = new Date();
    if (gatewayRef) p.gatewayRef = gatewayRef;
    await p.save({ session });

    await session.commitTransaction();
    session.endSession();
    return p;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function voidPayment(id, userId, reason) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const p = await Payment.findById(id).session(session);
    if (!p) throw new Error('Payment not found');
    if (String(p.user) !== String(userId)) throw new Error('Forbidden');
    if (p.voided) return p;
    p.voided = true;
    p.voidReason = reason || 'voided by user';
    p.voidedAt = new Date();
    p.status = 'CANCELLED';
    await p.save({ session });
    await session.commitTransaction();
    session.endSession();
    return p;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { createPayment, findById, listByUser, updatePayment, confirmPayment, voidPayment };
