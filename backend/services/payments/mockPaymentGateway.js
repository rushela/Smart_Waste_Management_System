// services/payments/mockPaymentGateway.js
// Simulate a payment gateway interaction.

function randomId(prefix = 'MOCK') {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}${rand}`;
}

async function charge({ amount, method = 'mock_gateway' }) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 50));
  if (amount <= 0) return { status: 'failed' };
  // 5% chance to fail to emulate real-world flakiness
  if (Math.random() < 0.05) return { status: 'failed' };
  return { status: 'completed', transactionId: randomId('_TX_'), method };
}

module.exports = { charge };
