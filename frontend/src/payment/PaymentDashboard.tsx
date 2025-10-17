import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import BalanceCard from './components/BalanceCard';
import PayNowButton from './components/PayNowButton';
import RecentTransactionTable from './components/RecentTransactionTable';
import { paymentsAPI } from '../api/payments.api';

interface DashboardData {
  outstandingBalance: number;
  recentTransactions: any[];
}

const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    outstandingBalance: 0,
    recentTransactions: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.listMine();
      setDashboardData({
        outstandingBalance: response.outstandingBalance,
        recentTransactions: response.data.slice(0, 5) // Last 5 transactions
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // In production, show user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/payment/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading your eco-dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100 md:p-6">
      <div className="mx-auto max-w-7xl">
        <HeaderBar />
        
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
          {/* Left Column - Balance and Actions */}
          <div className="space-y-6 lg:col-span-1">
            <BalanceCard balance={dashboardData.outstandingBalance} />
            <PayNowButton onClick={handleProceedToCheckout} />
            
            {/* Quick Stats */}
            <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                Your Eco Impact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon Saved</span>
                  <span className="text-sm font-medium text-green-600">124 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trees Planted</span>
                  <span className="text-sm font-medium text-green-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recycling Rate</span>
                  <span className="text-sm font-medium text-green-600">87%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactionTable 
              transactions={dashboardData.recentTransactions}
              onViewAll={() => navigate('/payment/history')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;