import http from './http.js';

const adaptListMine = (server) => {
  const payments = Array.isArray(server?.payments) ? server.payments : [];
  const outstandingBalance = payments
    .filter((p) => String(p.status).toUpperCase() === 'PENDING')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return {
    total: server?.total ?? payments.length,
    data: payments,            // for tables
    outstandingBalance,        // for dashboard
  };
};

export const paymentsAPI = {
  async listMine({ status, limit = 50, offset = 0 } = {}) {
    const params = { limit, offset };
    if (status) params.status = status;
  const res = await http.get('/payments/me', { params });
    return adaptListMine(res.data);
  },

  async checkout({ amount, currency = 'LKR', period, serviceType = 'WASTE_COLLECTION' }) {
  const res = await http.post('/payments/checkout', {
      amount,
      currency,
      period,      // e.g. "2025-10"
      serviceType, // e.g. "WASTE_COLLECTION"
    });
    const payment = res.data?.payment;
    return {
      payment,
      sessionId: payment?.gateway?.sessionId,   // "mock_<paymentId>"
      redirectUrl: payment?.gateway?.redirectUrl,
    };
  },

  async get(paymentId) {
  const res = await http.get(`/payments/${paymentId}`);
    return res.data?.payment;
  },

  async confirm(paymentId, status, gatewayRef) {
    const body = { status };
    if (gatewayRef) body.gatewayRef = gatewayRef;
  const res = await http.post(`/payments/${paymentId}/confirm`, body);
    return res.data; // { paymentId, status, ... }
  },
};

export default paymentsAPI;
