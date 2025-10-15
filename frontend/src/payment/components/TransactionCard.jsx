import React from 'react';

const TransactionCard = ({ transaction }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'green',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'pending':
        return {
          color: 'yellow',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'failed':
        return {
          color: 'red',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return { color: 'gray', icon: null };
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return { icon: '💳', label: 'Credit Card' };
      case 'paypal':
        return { icon: '🌿', label: 'PayPal' };
      case 'bank_transfer':
        return { icon: '🏦', label: 'Bank Transfer' };
      case 'system':
        return { icon: '⚡', label: 'System Credit' };
      default:
        return { icon: '💰', label: 'Other' };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'waste':
        return '🗑️';
      case 'recycling':
        return '♻️';
      case 'maintenance':
        return '🔧';
      case 'reward':
        return '⭐';
      case 'subscription':
        return '📅';
      case 'special':
        return '🎯';
      default:
        return '💰';
    }
  };

  const statusConfig = getStatusConfig(transaction.status);
  const methodConfig = getMethodIcon(transaction.method);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="transition-all duration-300 transform bg-white border border-green-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getCategoryIcon(transaction.category)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {transaction.description}
              </h3>
              <p className="text-xs text-gray-500">{transaction.id}</p>
            </div>
          </div>
          
          <div className={`bg-${statusConfig.color}-100 text-${statusConfig.color}-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
            {statusConfig.icon}
            <span className="capitalize">{transaction.status}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Amount and Date */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-2xl font-bold ${
              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-lg">{methodConfig.icon}</div>
            <p className="mt-1 text-xs text-gray-600">{methodConfig.label}</p>
          </div>
        </div>

        {/* Eco Impact */}
        <div className="p-3 mb-3 border border-green-200 bg-green-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <svg className="flex-shrink-0 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-medium text-green-700">
              {transaction.ecoImpact}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>Details</span>
          </button>
          
          {transaction.status === 'failed' && (
            <button className="flex-1 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-600">
              Retry
            </button>
          )}
          
          {transaction.status === 'completed' && (
            <button className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-white transition-colors duration-200 bg-green-500 rounded-lg hover:bg-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Receipt</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{transaction.type}</span>
          <span>{transaction.category}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;