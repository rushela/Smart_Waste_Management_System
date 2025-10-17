import React from 'react';
import { MockPaymentModal } from '../components/MockPaymentModal';
import { PaymentHistory } from '../components/PaymentHistory';
import { ToastContainer, useToast } from '../components/Toast';
import { DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import api from '../services/api';

export const PaymentsPage: React.FC = () => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [outstanding, setOutstanding] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [amountDue] = React.useState(30);
  const [city] = React.useState('Colombo');
  const [accountBalance, setAccountBalance] = React.useState(0);
  const { toasts, addToast, removeToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use the API service which already has the user ID header configured
      const hist = await api.get('/payments/history/me');
      setHistory(hist.data.items || hist.data || []);
      const sum = await api.get('/payments/summary');
      const outstandingVal = sum.data?.outstanding || 0;
      setOutstanding(outstandingVal);
      // Calculate balance from history
      const historyArray = hist.data.items || hist.data || [];
      const balance = historyArray.reduce((acc: number, item: any) => {
        return acc + (item.type === 'payback' ? Math.abs(item.amount) : -Math.abs(item.amount));
      }, 0);
      setAccountBalance(balance);
    } catch (e) { 
      console.error(e);
      // Show a more helpful error message
      addToast('No payment data available. Create a payment to get started!', 'info');
    } finally { 
      setLoading(false); 
    }
  };

  React.useEffect(() => { fetchData(); }, []);

  const onPayNow = () => setModalOpen(true);
  
  const onConfirmPayment = async (method: string, _cardData?: any) => {
    try {
      const res = await api.post('/payments', { 
        amount: amountDue, 
        method, 
        city, 
        paymentType: 'collection_fee', 
        billingModel: 'flat_fee' 
      }, { headers: { 'x-user-id': '000000000000000000000001' } });
      
      if (res.data?.status === 'completed') {
        addToast(`Payment successful! Transaction ID: ${res.data.transactionId}`, 'success');
        await fetchData();
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Payment failed. Please try again.', 'error');
      throw e;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Manage your waste collection payments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${amountDue.toFixed(2)}</p>
              </div>
              <div className="bg-[#2ECC71]/10 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#2ECC71]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${outstanding.toFixed(2)}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Account Balance</p>
                <p className={`text-2xl font-bold mt-1 ${accountBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${accountBalance.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{history.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Info & Quick Action */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#2ECC71] to-[#27ae60] rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-white/80 text-sm">City</p>
                <p className="font-semibold">{city}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Billing Model</p>
                <p className="font-semibold">Flat Fee</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Next Payment Due</p>
                <p className="font-semibold">End of Month</p>
              </div>
            </div>
            <button 
              onClick={onPayNow}
              className="w-full mt-6 bg-white text-[#2ECC71] font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all shadow-md"
            >
              Pay Now
            </button>
          </div>

          {/* Payment History */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <button className="text-sm text-[#2ECC71] font-medium hover:underline">
                View All
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2ECC71] border-t-transparent" />
              </div>
            ) : (
              <PaymentHistory items={history} />
            )}
          </div>
        </div>
      </div>

      <MockPaymentModal 
        open={modalOpen} 
        amount={amountDue} 
        onClose={() => setModalOpen(false)} 
        onConfirm={onConfirmPayment} 
      />
    </div>
  );
};
