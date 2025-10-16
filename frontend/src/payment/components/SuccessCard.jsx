import React, { useState } from 'react';

const SuccessCard = ({ paymentData }) => {
  const [showFullReceipt, setShowFullReceipt] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const getMethodDetails = (method) => {
    switch (method) {
      case 'credit_card':
        return { 
          icon: '💳', 
          label: 'Credit Card', 
          details: ` ending in ${paymentData.cardLast4}`,
          color: 'text-blue-600'
        };
      case 'paypal':
        return { 
          icon: '🌿', 
          label: 'PayPal', 
          details: '',
          color: 'text-blue-500'
        };
      case 'bank_transfer':
        return { 
          icon: '🏦', 
          label: 'Bank Transfer', 
          details: '',
          color: 'text-green-600'
        };
      default:
        return { 
          icon: '💰', 
          label: 'Payment', 
          details: '',
          color: 'text-gray-600'
        };
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    // Simulate receipt download
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDownloading(false);
    alert('Receipt downloaded successfully!');
  };

  const handleShareEcoImpact = () => {
    const shareText = `I just contributed to environmental sustainability through EcoBinPay! Saved ${paymentData.ecoImpact?.co2Saved || '2.5kg'} of CO₂ and supported ${paymentData.ecoImpact?.treesSupported || 1} tree. Join me in making a difference! 🌱`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Eco Impact',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Eco impact message copied to clipboard!');
    }
  };

  const methodDetails = getMethodDetails(paymentData.method);

  return (
    <div className="overflow-hidden bg-white border border-green-200 shadow-xl rounded-2xl">
      {/* Success Header */}
      <div className="relative p-8 overflow-hidden text-center text-white bg-gradient-to-r from-green-500 to-emerald-600">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-6 h-6 bg-white rounded-full top-4 left-10 bg-opacity-10 animate-pulse"></div>
          <div className="absolute w-8 h-8 delay-300 bg-white rounded-full bottom-6 right-12 bg-opacity-15 animate-pulse"></div>
          <div className="absolute w-4 h-4 delay-700 bg-white rounded-full top-12 right-20 bg-opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-white border-4 border-white rounded-full bg-opacity-20 border-opacity-30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mb-3 text-3xl font-bold">Payment Successful!</h2>
          <p className="text-lg text-green-100 opacity-90">Your eco-payment has been processed successfully</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Amount Display */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium tracking-wide text-gray-600 uppercase">Amount Paid</p>
          <p className="text-5xl font-bold text-transparent text-gray-800 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text">
            ${paymentData.amount?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 mb-6 border border-gray-200 bg-gray-50 rounded-2xl">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
            <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transaction Details
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Transaction ID:</span>
              <span className="px-3 py-1 font-mono font-semibold text-gray-800 bg-gray-100 rounded-lg">
                {paymentData.transactionId || paymentData._id}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Date & Time:</span>
              <span className="font-medium text-gray-800">{formatDate(paymentData.date)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Payment Method:</span>
              <span className={`font-medium ${methodDetails.color} flex items-center space-x-2`}>
                <span className="text-xl">{methodDetails.icon}</span>
                <span>{methodDetails.label}{methodDetails.details}</span>
              </span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="font-medium text-gray-600">Description:</span>
              <span className="max-w-xs font-medium text-right text-gray-800">
                {paymentData.description || 'EcoBinPay Service Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Eco Impact */}
        <div className="p-6 mb-6 border border-green-200 bg-green-50 rounded-2xl">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-green-800">
            <svg className="w-6 h-6 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your Eco Impact
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 transition-shadow duration-300 bg-white border border-green-200 rounded-xl hover:shadow-lg">
              <div className="mb-2 text-3xl">🌱</div>
              <p className="mb-1 text-xs font-medium tracking-wide text-gray-600 uppercase">CO₂ Saved</p>
              <p className="text-lg font-bold text-green-700">{paymentData.ecoImpact?.co2Saved || '2.5kg'}</p>
            </div>
            <div className="p-4 transition-shadow duration-300 bg-white border border-green-200 rounded-xl hover:shadow-lg">
              <div className="mb-2 text-3xl">🌳</div>
              <p className="mb-1 text-xs font-medium tracking-wide text-gray-600 uppercase">Trees Supported</p>
              <p className="text-lg font-bold text-green-700">{paymentData.ecoImpact?.treesSupported || 1}</p>
            </div>
            <div className="p-4 transition-shadow duration-300 bg-white border border-green-200 rounded-xl hover:shadow-lg">
              <div className="mb-2 text-3xl">♻️</div>
              <p className="mb-1 text-xs font-medium tracking-wide text-gray-600 uppercase">Recycling Credit</p>
              <p className="text-lg font-bold text-green-700">${paymentData.ecoImpact?.recyclingCredit || '5.25'}</p>
            </div>
          </div>
          
          {/* Eco Message */}
          <div className="p-3 mt-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-center text-green-800">
              <span className="font-semibold">Thank you!</span> Your payment supports sustainable waste management and environmental conservation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <button
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="flex items-center justify-center px-6 py-4 space-x-3 font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>{downloading ? 'Downloading...' : 'Download Receipt'}</span>
          </button>
          
          <button
            onClick={handleShareEcoImpact}
            className="flex items-center justify-center px-6 py-4 space-x-3 font-medium text-white transition-all duration-200 bg-green-500 hover:bg-green-600 rounded-xl hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share Eco Impact</span>
          </button>
        </div>

        {/* Expandable Receipt */}
        <div className="overflow-hidden border border-gray-300 rounded-2xl">
          <button
            onClick={() => setShowFullReceipt(!showFullReceipt)}
            className="flex items-center justify-between w-full p-5 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 group"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold text-gray-800 group-hover:text-gray-900">View Digital Receipt</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                showFullReceipt ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showFullReceipt && (
            <div className="p-5 bg-white border-t border-gray-300">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Customer Name:</span>
                  <span className="font-medium text-gray-800">Alex Johnson</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-800">ECO-7842-2198</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">alex.johnson@example.com</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Payment Gateway:</span>
                  <span className="font-medium text-gray-800">EcoPay Secure</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Authorization Code:</span>
                  <span className="font-mono font-medium text-gray-800">AUTH-{paymentData.transactionId?.split('-')[2] || '7842'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-medium text-gray-600">Transaction Status:</span>
                  <span className="px-3 py-1 text-xs font-medium tracking-wide text-green-800 uppercase bg-green-100 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-green-200 bg-green-50">
        <div className="flex items-center justify-center space-x-3 text-green-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Your receipt has been emailed to alex.johnson@example.com</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;