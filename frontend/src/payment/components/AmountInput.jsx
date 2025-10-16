import React from 'react';

const AmountInput = ({ amount, onAmountChange }) => {
  const quickAmounts = [25, 50, 100, 250];

  const handleCustomAmount = (value) => {
    const numValue = parseFloat(value) || 0;
    onAmountChange(numValue);
  };

  return (
    <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
      <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        Payment Amount
      </h2>

      {/* Quick Amount Buttons */}
      <div className="mb-6">
        <p className="mb-3 text-sm text-gray-600">Quick select:</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => onAmountChange(quickAmount)}
              className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                amount === quickAmount
                  ? 'border-green-500 bg-green-50 text-green-700 font-semibold shadow-md'
                  : 'border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Or enter custom amount:
        </label>
        <div className="relative">
          <span className="absolute font-medium text-gray-500 transform -translate-y-1/2 left-4 top-1/2">
            $
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={amount || ''}
            onChange={(e) => handleCustomAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full py-3 pl-10 pr-4 text-lg font-medium transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Amount Validation */}
      {amount > 0 && (
        <div className="p-3 mt-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center space-x-2 text-green-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Payment amount set to ${amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Eco Message */}
      <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-yellow-700">
            <span className="font-medium">Eco Tip:</span> Your payment contributes to sustainable waste management and environmental conservation efforts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmountInput;