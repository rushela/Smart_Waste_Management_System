import React from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: (method: string, cardData?: any) => Promise<void>;
};

export const MockPaymentModal: React.FC<Props> = ({ open, amount, onClose, onConfirm }) => {
  const [method, setMethod] = React.useState('card');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  
  // Card form state
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const validateCard = () => {
    if (method === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
        setError('Invalid card number');
        return false;
      }
      if (!cardName) {
        setError('Card name is required');
        return false;
      }
      if (!expiry || expiry.length < 5) {
        setError('Invalid expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setError('Invalid CVV');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateCard()) return;

    setLoading(true);
    try {
      const cardData = method === 'card' ? { cardNumber, cardName, expiry, cvv } : undefined;
      await onConfirm(method, cardData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (e: any) {
      setError(e.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMethod('card');
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  React.useEffect(() => {
    if (open) reset();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27ae60] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <CreditCard className="h-8 w-8 mb-2" />
          <h3 className="text-xl font-bold">Secure Payment</h3>
          <p className="text-white/90 text-sm mt-1">Complete your transaction safely</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-[#2ECC71]/20">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900">${amount.toFixed(2)}</p>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Payment Successful!</p>
                <p className="text-sm text-green-700">Your transaction has been processed.</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!success && (
            <>
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['card', 'bank', 'mobile'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        method === m
                          ? 'border-[#2ECC71] bg-[#2ECC71]/10 text-[#2ECC71]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {m === 'card' ? '💳 Card' : m === 'bank' ? '🏦 Bank' : '📱 Mobile'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Payment Form */}
              {method === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank/Mobile Info */}
              {method !== 'card' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {method === 'bank'
                      ? '🏦 You will be redirected to your bank portal to complete the payment.'
                      : '📱 Mobile payment gateway will be launched to complete the transaction.'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Processing...
                    </span>
                  ) : (
                    `Pay $${amount.toFixed(2)}`
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security Badge */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-xs text-gray-500 text-center">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
