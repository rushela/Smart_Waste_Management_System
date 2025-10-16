import http from './http.js';

// Mock data for frontend development
const mockPayments = [
  {
    _id: '1',
    amount: 82.50,
    status: 'completed',
    type: 'payment',
    description: 'Monthly Waste Collection Service',
    date: '2024-01-15T10:30:00Z',
    method: 'credit_card',
    cardLast4: '4242',
    transactionId: 'ECO-7842-001',
    ecoImpact: {
      co2Saved: '2.5kg',
      treesSupported: 1,
      recyclingCredit: '5.25'
    }
  },
  {
    _id: '2',
    amount: 45.00,
    status: 'pending',
    type: 'payment',
    description: 'Green Bin Maintenance',
    date: '2024-01-10T14:20:00Z',
    method: 'bank_transfer',
    transactionId: 'ECO-7842-002'
  }
];

// API functions with proper error handling and TypeScript-like interfaces
export const paymentsAPI = {
  /**
   * Fetch user's payment history
   */
  listMine: async () => {
    try {
      // const response = await http.get('/payments');
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockPayments,
            total: mockPayments.length,
            outstandingBalance: 127.50
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  },

  /**
   * Create a new payment checkout session
   */
  checkout: async (paymentData) => {
    try {
      // const response = await http.post('/payments/checkout', paymentData);
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            paymentId: `pay_${Date.now()}`,
            redirectUrl: `/mock-gateway?pid=pay_${Date.now()}&amount=${paymentData.amount}`,
            amount: paymentData.amount
          });
        }, 1000);
      });
    } catch (error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
  },

  /**
   * Get specific payment details
   */
  get: async (paymentId) => {
    try {
      // const response = await http.get(`/payments/${paymentId}`);
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const payment = mockPayments.find(p => p._id === paymentId);
          if (payment) {
            resolve(payment);
          } else {
            reject(new Error('Payment not found'));
          }
        }, 500);
      });
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  },

  /**
   * Confirm payment status (for mock gateway)
   */
  confirm: async (paymentId, status) => {
    try {
      // const response = await http.post(`/payments/${paymentId}/confirm`, { status });
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            paymentId,
            status,
            transactionId: `ECO-${Date.now()}`
          });
        }, 800);
      });
    } catch (error) {
      throw new Error(`Confirmation failed: ${error.message}`);
    }
  }
};

export default paymentsAPI;