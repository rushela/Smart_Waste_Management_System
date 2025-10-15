import React, { useState } from 'react';
import GatewayForm from './components/GatewayForm';
import AmountInput from './components/AmountInput';
import ConfirmPaymentButton from './components/ConfirmPaymentButton';

const PaymentCheckout = () => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🌿' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

  const handlePaymentSubmit = (paymentData) => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment processed successfully!');
      setIsProcessing(false);
    }, 2000);
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
            {/* Payment Method Selection */}
            <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="mb-2 text-2xl">{method.icon}</div>
                    <p className="font-medium text-gray-800">{method.name}</p>
                  </button>
                ))}
              </div>

              {/* Payment Form */}
              <GatewayForm selectedMethod={selectedMethod} />
            </div>

            {/* Amount Input */}
            <AmountInput 
              amount={paymentAmount}
              onAmountChange={setPaymentAmount}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">$82.50</span>
                  </div>
                </div>
                {paymentAmount > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custom Amount</span>
                      <span className="font-medium text-green-600">${paymentAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Eco Impact */}
              <div className="p-4 mb-6 bg-green-50 rounded-xl">
                <div className="flex items-center mb-2 space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Eco Impact</span>
                </div>
                <p className="text-xs text-green-700">
                  This payment supports sustainable waste management and helps reduce carbon emissions.
                </p>
              </div>

              {/* Confirm Button */}
              <ConfirmPaymentButton 
                amount={paymentAmount || 82.50}
                isProcessing={isProcessing}
                onSubmit={handlePaymentSubmit}
              />
            </div>

            {/* Security Badge */}
            <div className="p-6 text-center bg-white border border-green-100 shadow-lg rounded-2xl">
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
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
      </div>
    </div>
  );
};

export default PaymentCheckout;