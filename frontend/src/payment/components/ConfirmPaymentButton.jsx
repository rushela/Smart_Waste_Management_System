import React, { useState } from 'react';

const ConfirmPaymentButton = ({ amount, isProcessing, onSubmit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (amount > 0) {
      onSubmit({
        amount,
        timestamp: new Date().toISOString(),
        method: 'card'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Total Amount Display */}
      <div className="p-4 text-center border border-gray-200 bg-gray-50 rounded-xl">
        <p className="mb-1 text-sm text-gray-600">Total Amount</p>
        <p className="text-2xl font-bold text-gray-800">${amount.toFixed(2)}</p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleClick}
        disabled={isProcessing || amount <= 0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
          isProcessing || amount <= 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl'
        } flex items-center justify-center space-x-3`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Confirm Payment</span>
          </>
        )}
      </button>

      {/* Security Message */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-2 space-x-2 text-xs text-gray-500">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>256-bit SSL Secured</span>
        </div>
        <p className="text-xs text-gray-500">
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Eco Commitment */}
      <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
        <div className="flex items-center mb-2 space-x-2">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-green-800">Eco Commitment</span>
        </div>
        <p className="text-xs text-green-700">
          5% of every payment supports environmental conservation projects and sustainable waste management initiatives.
        </p>
      </div>
    </div>
  );
};

export default ConfirmPaymentButton;