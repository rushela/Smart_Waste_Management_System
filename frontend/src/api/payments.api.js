import http from './http.js';

// paymentsAPI - wrapper around HTTP endpoints. Keeps compatibility with
// previous frontend expectations: when the server returns an array we'll
// compute a small envelope; when it returns an object we'll forward it.
export const paymentsAPI = {
  /**
   * Fetch user's payment history / dashboard data
   * Returns: { data: [], total: number, outstandingBalance: number } or server-provided object
   */
  listMine: async () => {
    try {
      const res = await http.get('/payments');
      const raw = res.data;
      if (Array.isArray(raw)) {
        const data = raw;
        const outstandingBalance = data
          .filter((p) => (p.status || '').toLowerCase() === 'pending')
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        return {
          data,
          total: data.length,
          outstandingBalance
        };
      }
      // server returned an object (e.g., { data: [...], total, outstandingBalance })
      return raw;
    } catch (error) {
      console.error('paymentsAPI.listMine error:', error);
      throw error;
    }
  },

  /**
   * Create a new checkout session
   * Expects paymentData: { amount, returnUrl, saveCard?, method? }
   */
  checkout: async (paymentData) => {
    try {
      const res = await http.post('/payments/checkout', paymentData);
      return res.data;
    } catch (error) {
      console.error('paymentsAPI.checkout error:', error);
      throw error;
    }
  },

  /**
   * Get payment by id or internal id
   */
  get: async (paymentId) => {
    try {
      const res = await http.get(`/payments/${paymentId}`);
      return res.data;
    } catch (error) {
      console.error('paymentsAPI.get error:', error);
      throw error;
    }
  },

  /**
   * Confirm a payment (optional endpoint used after client-side flows)
   */
  confirm: async (paymentId, status) => {
    try {
      const res = await http.post(`/payments/${paymentId}/confirm`, { status });
      return res.data;
    } catch (error) {
      console.error('paymentsAPI.confirm error:', error);
      throw error;
    }
  }
};

export default paymentsAPI;