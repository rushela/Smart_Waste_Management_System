import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../api/payments.api';

const MockGateway = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const paymentId = searchParams.get('pid');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!paymentId || !amount) {
      navigate('/payment');
      return;
    }
    setPaymentInfo({ paymentId, amount });
  }, [paymentId, amount, navigate]);

  const handlePaymentAction = async (success) => {
    try {
      setProcessing(true);
      await paymentsAPI.confirm(paymentId, success ? 'completed' : 'failed');
      
      // Navigate to status page
      navigate(`/payment/status?paymentId=${paymentId}`);
    } catch (error) {
      console.error('Payment action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading payment gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md overflow-hidden bg-white border border-green-200 shadow-xl rounded-2xl">
        {/* Gateway Header */}
        <div className="p-6 text-center text-white bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex items-center justify-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full bg-opacity-20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">EcoPay Secure</h1>
          </div>
          <p className="text-green-100 opacity-90">Secure Payment Gateway</p>
        </div>

        {/* Payment Details */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <p className="mb-1 text-sm text-gray-600">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-800">${parseFloat(amount).toFixed(2)}</p>
          </div>

          <div className="p-4 mb-6 bg-gray-50 rounded-xl">
            <h3 className="mb-3 font-semibold text-gray-800">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant:</span>
                <span className="text-gray-800">EcoBinPay Services</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-gray-800">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="text-gray-800">Eco Service Payment</span>
              </div>
            </div>
          </div>

          {/* Mock Card Form */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                readOnly
                value="4242 4242 4242 4242"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="12/24"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                readOnly
                value="12/24"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                readOnly
                value="123"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handlePaymentAction(true)}
              disabled={processing}
              className="flex items-center justify-center w-full px-6 py-4 space-x-3 font-semibold text-white transition-all duration-200 bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{processing ? 'Processing...' : 'Pay Now'}</span>
            </button>

            <button
              onClick={() => handlePaymentAction(false)}
              disabled={processing}
              className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simulate Payment Failure
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockGateway;