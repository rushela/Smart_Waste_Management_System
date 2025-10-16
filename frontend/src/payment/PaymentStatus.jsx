import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SuccessCard from './components/SuccessCard';
import ErrorCard from './components/ErrorCard';
import BackToDashboardButton from './components/BackToDashboardButton';
import { paymentsAPI } from '../api/payments.api';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing');

  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!paymentId) {
      navigate('/payment');
      return;
    }
    fetchPaymentStatus();
  }, [paymentId, navigate]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      const payment = await paymentsAPI.get(paymentId);
      setPaymentData(payment);
      setStatus(payment.status);
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="w-full max-w-md p-8 text-center bg-white border border-green-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <div className="w-8 h-8 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">Processing Payment</h2>
          <p className="text-gray-600">We're confirming your transaction details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Payment {status === 'completed' ? 'Successful' : 'Status'}
            </h1>
          </div>
        </div>

        {status === 'completed' ? (
          <SuccessCard paymentData={paymentData} />
        ) : (
          <ErrorCard paymentData={paymentData} />
        )}

        <div className="mt-6 space-y-4">
          <BackToDashboardButton />
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;