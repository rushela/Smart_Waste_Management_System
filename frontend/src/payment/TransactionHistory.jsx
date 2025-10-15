import React, { useState } from 'react';
import TransactionFilterBar from './components/TransactionFilterBar';
import TransactionCard from './components/TransactionCard';

const TransactionHistory = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  });

  const transactions = [
    {
      id: 'ECO-7842-001',
      date: '2024-01-15',
      description: 'Monthly Waste Collection Service',
      amount: -45.00,
      status: 'completed',
      type: 'payment',
      method: 'credit_card',
      category: 'waste',
      ecoImpact: '2.5kg CO2 saved'
    },
    {
      id: 'ECO-7842-002',
      date: '2024-01-10',
      description: 'Recycling Credit - Plastic',
      amount: 12.50,
      status: 'completed',
      type: 'credit',
      method: 'system',
      category: 'recycling',
      ecoImpact: '15 bottles recycled'
    },
    {
      id: 'ECO-7842-003',
      date: '2024-01-08',
      description: 'Green Bin Maintenance',
      amount: -32.00,
      status: 'pending',
      type: 'payment',
      method: 'bank_transfer',
      category: 'maintenance',
      ecoImpact: 'Organic waste processed'
    },
    {
      id: 'ECO-7842-004',
      date: '2024-01-05',
      description: 'Eco Reward Bonus',
      amount: 5.00,
      status: 'completed',
      type: 'credit',
      method: 'system',
      category: 'reward',
      ecoImpact: 'Sustainable choice'
    },
    {
      id: 'ECO-7842-005',
      date: '2024-01-02',
      description: 'Annual Subscription Renewal',
      amount: -120.00,
      status: 'completed',
      type: 'payment',
      method: 'credit_card',
      category: 'subscription',
      ecoImpact: 'Annual eco commitment'
    },
    {
      id: 'ECO-7842-006',
      date: '2023-12-28',
      description: 'Holiday Service Fee',
      amount: -25.00,
      status: 'failed',
      type: 'payment',
      method: 'paypal',
      category: 'special',
      ecoImpact: 'Extra collection'
    },
    {
      id: 'ECO-7842-007',
      date: '2023-12-20',
      description: 'Paper Recycling Credit',
      amount: 8.75,
      status: 'completed',
      type: 'credit',
      method: 'system',
      category: 'recycling',
      ecoImpact: '12kg paper saved'
    },
    {
      id: 'ECO-7842-008',
      date: '2023-12-15',
      description: 'Monthly Waste Collection',
      amount: -45.00,
      status: 'completed',
      type: 'payment',
      method: 'credit_card',
      category: 'waste',
      ecoImpact: '2.5kg CO2 saved'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    
    // Date range filtering (simplified)
    if (filters.dateRange === 'last30' && new Date(transaction.date) < new Date('2023-12-15')) {
      return false;
    }
    
    return true;
  });

  const stats = {
    totalSpent: transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalCredits: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    completed: transactions.filter(t => t.status === 'completed').length
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto">
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
            
            <div className="flex items-center space-x-6 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-lg font-bold text-red-600">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Eco Credits</p>
                <p className="text-lg font-bold text-green-600">+${stats.totalCredits.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-lg font-bold text-blue-600">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          totalTransactions={filteredTransactions.length}
        />

        {/* Transactions Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No transactions found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your filters to see more results</p>
            <button 
              onClick={() => setFilters({ status: 'all', dateRange: 'all', type: 'all' })}
              className="px-6 py-2 font-medium text-white transition-colors duration-200 bg-green-500 hover:bg-green-600 rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 font-medium text-green-600 transition-all duration-200 bg-white border border-green-200 hover:bg-green-50 rounded-xl hover:shadow-lg">
              Load More Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;