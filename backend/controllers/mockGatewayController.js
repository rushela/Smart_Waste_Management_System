const dayjs = require('dayjs');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const ResidentCredit = require('../models/ResidentCredit');

exports.charge = async (req, res) => {
  try {
    // If you mounted this route before the guard, req.user may be undefined during testing.
    // In real usage, it will be set by the guard. For testing, allow a fake userId in header.
    const userId = req.user?._id || req.header('x-user-id') || null;

    let { amount, card, savedCardId, allocations = [], autoAllocate = true } = req.body;
    amount = Number(amount || 0);
    if (amount <= 0) return res.status(400).json({ ok: false, reason: 'Amount must be > 0' });

    // 1) Ensure ResidentCredit doc exists (FIXED)
    let rc = await ResidentCredit.findOne({ userId });
    if (!rc) rc = await ResidentCredit.create({ userId, balance: 0 });

    // 2) credit first
    const creditUsed = Math.min(rc.balance, amount);
    const chargeAmount = Number((amount - creditUsed).toFixed(2));

    // 3) mock approval
    const maskedPan = card?.number ? `**** **** **** ${String(card.number).slice(-4)}` : '**** **** **** 0000';
    const approved = simulateApproval(chargeAmount, card);
    if (!approved) return res.status(402).json({ ok: false, reason: 'Mock decline', maskedPan });

    // 4) allocations
    let finalAllocs = allocations;
    if ((!finalAllocs || !finalAllocs.length) && autoAllocate) {
      let remaining = amount;
      const open = await Invoice.find({ userId, status: { $in: ['OPEN', 'PARTIAL'] } })
        .sort({ createdAt: 1 });
      finalAllocs = [];
      for (const inv of open) {
        if (remaining <= 0) break;
        const apply = Math.min(inv.balance, remaining);
        if (apply > 0) { finalAllocs.push({ invoiceId: inv._id, amount: apply }); remaining -= apply; }
      }
    }

    // 5) apply to invoices
    let applied = 0;
    for (const a of finalAllocs) {
      const inv = await Invoice.findOne({ _id: a.invoiceId, userId });
      if (!inv) continue;
      const apply = Math.min(inv.balance, Number(a.amount || 0));
      if (apply <= 0) continue;
      inv.balance = Number((inv.balance - apply).toFixed(2));
      inv.status = inv.balance <= 0 ? 'PAID' : 'PARTIAL';
      await inv.save();
      applied += apply;
    }

    // 6) update credit (used + leftover)
    rc.balance = Number((rc.balance - creditUsed).toFixed(2));
    const leftover = Number((amount - applied).toFixed(2));
    if (leftover > 0) rc.balance = Number((rc.balance + leftover).toFixed(2));
    await rc.save();

    // 7) posted payment + receipt
    const receiptNo = `RCPT-${dayjs().format('YYYYMMDD-HHmmss')}-${String(Math.random()).slice(2, 6)}`;
    const payment = await Payment.create({
      userId,
      amount,
      method: 'MockCard',
      status: 'Posted',
      allocations: finalAllocs.map(a => ({ invoiceId: a.invoiceId, amount: Number(a.amount) })),
      receiptNo
    });

    res.status(201).json({
      ok: true,
      paymentId: payment._id,
      receiptNo,
      maskedPan,
      applied,
      creditUsed,
      newCreditBalance: rc.balance
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, reason: 'Server error' });
  }
};

function simulateApproval(chargeAmount, card) {
  if (card && String(card.cvv || '').length < 3) return false;
  if (Math.round((chargeAmount - Math.floor(chargeAmount)) * 100) === 13) return false; // unlucky .13
  return true;
}
