import React, { useState } from 'react';

const PayNowButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePayment = () => {
    // Redirect to payment gateway
    alert('Redirecting to secure payment gateway...');
    // In real implementation: window.location.href = '/payment-gateway';
  };

  return (
    <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
      <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Quick Payment
      </h3>
      
      <p className="mb-4 text-sm text-gray-600">
        Securely pay your outstanding balance using our eco-friendly payment partners.
      </p>
      
      <button
        onClick={handlePayment}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-full px-6 py-4 space-x-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl hover:scale-105 hover:shadow-xl"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <span>Pay Now Securely</span>
      </button>
      
      <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Eco-Certified</span>
        </div>
      </div>
      
      {/* Quick amount options */}
      <div className="pt-4 mt-6 border-t border-gray-100">
        <p className="mb-3 text-sm text-gray-600">Pay custom amount:</p>
        <div className="grid grid-cols-3 gap-2">
          {[25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => alert(`Paying $${amount}...`)}
              className="px-3 py-2 text-sm font-medium text-green-700 transition-colors duration-200 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayNowButton;