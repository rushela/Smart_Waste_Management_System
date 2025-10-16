import React, { useState } from 'react';

const GatewayForm = ({ selectedMethod }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    saveCard: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  if (selectedMethod === 'paypal') {
    return (
      <div className="py-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <span className="text-2xl">🌿</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Pay with PayPal</h3>
        <p className="mb-4 text-gray-600">You'll be redirected to PayPal to complete your payment</p>
        <button className="px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-500 hover:bg-blue-600 rounded-xl">
          Continue to PayPal
        </button>
      </div>
    );
  }

  if (selectedMethod === 'bank') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Bank Account Number
          </label>
          <input
            type="text"
            placeholder="Enter account number"
            className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Routing Number
          </label>
          <input
            type="text"
            placeholder="Enter routing number"
            className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
            maxLength={19}
            className="w-full px-4 py-3 pl-12 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
            maxLength={5}
            className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* CVV */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Save Card Option */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="saveCard"
          checked={formData.saveCard}
          onChange={(e) => handleInputChange('saveCard', e.target.checked)}
          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="saveCard" className="text-sm text-gray-700">
          Save card for future payments
        </label>
      </div>

      {/* Card Logos */}
      <div className="flex pt-2 space-x-3">
        {['visa', 'mastercard', 'amex'].map((card) => (
          <div key={card} className="flex items-center justify-center w-12 h-8 bg-gray-100 border border-gray-300 rounded">
            <span className="text-xs font-medium text-gray-600">{card}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GatewayForm;