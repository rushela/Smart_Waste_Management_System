import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionFilterBar from './components/TransactionFilterBar';
import TransactionCard from './components/TransactionCard';
import { paymentsAPI } from '../api/payments.api';

interface Filters {
  status: string;
  dateRange: string;
  type: string;
}

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.listMine();
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="p-6 mb-6 bg-white border border-green-100 shadow-lg rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 space-x-4 md:mb-0">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <svg className="text-white w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                <p className="text-gray-600">Track your eco-payments and recycling credits</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/payment')}
              className="px-6 py-2 font-medium text-white transition-colors duration-200 bg-green-500 hover:bg-green-600 rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <TransactionFilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          totalTransactions={filteredTransactions.length}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction._id}
              transaction={transaction}
            />
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;