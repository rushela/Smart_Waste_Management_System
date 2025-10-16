import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorCard = ({ paymentData }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetryPayment = () => {
    navigate('/payment/checkout');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@ecobinpay.com?subject=Payment%20Issue&body=Hello%20EcoBinPay%20Support,';
  };

  const errorSuggestions = [
    {
      icon: '💳',
      title: 'Check Payment Details',
      description: 'Verify your card number, expiry date, and CVV are correct',
      action: 'Update card information'
    },
    {
      icon: '💰',
      title: 'Sufficient Funds',
      description: 'Ensure your account has enough balance to cover the payment',
      action: 'Check account balance'
    },
    {
      icon: '🌐',
      title: 'Network Issues',
      description: 'Check your internet connection and try again',
      action: 'Retry payment'
    },
    {
      icon: '🛡️',
      title: 'Bank Restrictions',
      description: 'Your bank might have blocked the transaction for security',
      action: 'Contact your bank'
    }
  ];

  const getMethodDetails = (method) => {
    switch (method) {
      case 'credit_card':
        return { icon: '💳', label: 'Credit Card' };
      case 'paypal':
        return { icon: '🌿', label: 'PayPal' };
      case 'bank_transfer':
        return { icon: '🏦', label: 'Bank Transfer' };
      default:
        return { icon: '💰', label: 'Payment Method' };
    }
  };

  const methodDetails = getMethodDetails(paymentData?.method);

  return (
    <div className="overflow-hidden bg-white border border-red-200 shadow-xl rounded-2xl">
      {/* Error Header */}
      <div className="relative p-8 overflow-hidden text-center text-white bg-gradient-to-r from-red-500 to-orange-500">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-5 h-5 bg-white rounded-full top-6 right-16 bg-opacity-10 animate-pulse"></div>
          <div className="absolute delay-500 bg-white rounded-full bottom-8 left-12 w-7 h-7 bg-opacity-15 animate-pulse"></div>
          <div className="absolute w-4 h-4 delay-1000 bg-white rounded-full top-16 left-20 bg-opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-white border-4 border-white rounded-full bg-opacity-20 border-opacity-30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-3 text-3xl font-bold">Payment Failed</h2>
          <p className="text-lg text-red-100 opacity-90">We couldn't process your payment at this time</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error Message */}
        <div className="p-6 mb-6 border border-red-200 bg-red-50 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 bg-red-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-red-800">Transaction Declined</h3>
              <p className="mb-3 text-red-700">
                Your payment of <span className="font-bold">${paymentData?.amount?.toFixed(2) || '0.00'}</span> was not processed successfully. 
                This could be due to insufficient funds, incorrect card details, or temporary bank restrictions.
              </p>
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last attempt: {formatDate(paymentData?.date || new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="p-6 mb-6 border border-gray-200 bg-gray-50 rounded-2xl">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
            <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transaction Details
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Transaction ID:</span>
              <span className="px-3 py-1 font-mono font-semibold text-gray-800 bg-gray-100 rounded-lg">
                {paymentData?.transactionId || paymentData?._id || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Date & Time:</span>
              <span className="font-medium text-gray-800">{formatDate(paymentData?.date || new Date().toISOString())}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Amount:</span>
              <span className="font-medium text-gray-800">${paymentData?.amount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Payment Method:</span>
              <span className="flex items-center space-x-2 font-medium text-gray-800">
                <span className="text-xl">{methodDetails.icon}</span>
                <span>{methodDetails.label}</span>
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-medium text-gray-600">Status:</span>
              <span className="px-3 py-1 text-xs font-medium tracking-wide text-red-800 uppercase bg-red-100 rounded-full">
                Declined
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Solutions */}
        <div className="mb-6">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
            <svg className="w-6 h-6 mr-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Suggested Solutions
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {errorSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 transition-shadow duration-300 border border-yellow-200 bg-yellow-50 rounded-xl hover:shadow-lg">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-yellow-800">{suggestion.title}</h4>
                    <p className="mb-2 text-sm text-yellow-700">{suggestion.description}</p>
                    <button className="text-sm font-medium text-yellow-600 underline hover:text-yellow-700">
                      {suggestion.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRetryPayment}
            className="flex items-center justify-center w-full px-6 py-4 space-x-3 font-semibold text-white transition-all duration-200 bg-red-500 hover:bg-red-600 rounded-xl hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Payment Again</span>
          </button>

          <button
            onClick={handleContactSupport}
            className="flex items-center justify-center w-full px-6 py-4 space-x-3 font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Contact Support</span>
          </button>
        </div>

        {/* Support Information */}
        <div className="p-4 mt-6 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="mb-1 font-semibold text-blue-800">Need Immediate Help?</h4>
              <p className="text-sm text-blue-700">
                Our support team is available 24/7. Email us at{' '}
                <a href="mailto:support@ecobinpay.com" className="font-medium underline hover:text-blue-800">
                  support@ecobinpay.com
                </a>{' '}
                or call <span className="font-medium">1-800-ECO-BIN1</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-red-200 bg-red-50">
        <div className="flex items-center justify-center space-x-3 text-red-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">No amount has been charged to your account</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;