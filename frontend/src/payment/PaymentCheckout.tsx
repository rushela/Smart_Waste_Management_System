import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GatewayForm from './components/GatewayForm';
import AmountInput from './components/AmountInput';
import ConfirmPaymentButton from './components/ConfirmPaymentButton';
import { paymentsAPI } from '../api/payments.api';

interface PaymentData {
  amount: number;
  timestamp: string;
  method: string;
}

const PaymentCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [paymentAmount, setPaymentAmount] = useState(82.50);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    try {
      setProcessing(true);
      const checkoutSession = await paymentsAPI.checkout({
        amount: paymentData.amount,
        method: selectedMethod,
        description: 'EcoBinPay Service Payment'
      });
      
      // Redirect to mock gateway
      navigate(checkoutSession.redirectUrl);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">EcoBinPay Checkout</h1>
          </div>
          <p className="text-gray-600">Secure payment for sustainable waste management</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Payment Form */}
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Method
              </h2>
              <GatewayForm 
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
              />
            </div>

            <AmountInput 
              amount={paymentAmount}
              onAmountChange={setPaymentAmount}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <div className="sticky p-6 bg-white border border-green-100 shadow-lg rounded-2xl top-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Payment Summary</h3>
              
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Waste Collection Fee</span>
                  <span className="font-medium">$45.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recycling Service</span>
                  <span className="font-medium">$32.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Eco Tax</span>
                  <span className="font-medium">$5.50</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="text-green-600">${paymentAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <ConfirmPaymentButton 
                amount={paymentAmount}
                isProcessing={processing}
                onSubmit={handlePaymentSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;