import React from 'react';
import HeaderBar from './components/HeaderBar';
import BalanceCard from './components/BalanceCard';
import PayNowButton from './components/PayNowButton';
import RecentTransactionTable from './components/RecentTransactionTable';

const PaymentDashboard = () => {
  const userData = {
    name: "Alex Johnson",
    balance: 245.67,
    accountNumber: "ECO-7842-2198"
  };

  const recentTransactions = [
    { id: 1, date: "2024-01-15", description: "Monthly Waste Collection", amount: -45.00, status: "Completed", type: "payment" },
    { id: 2, date: "2024-01-10", description: "Recycling Credit", amount: 12.50, status: "Completed", type: "credit" },
    { id: 3, date: "2024-01-05", description: "Green Bin Service", amount: -32.00, status: "Completed", type: "payment" },
    { id: 4, date: "2024-01-02", description: "Eco Reward Bonus", amount: 5.00, status: "Completed", type: "credit" },
    { id: 5, date: "2023-12-28", description: "Annual Maintenance", amount: -120.00, status: "Completed", type: "payment" }
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100 md:p-6">
      <div className="max-w-6xl mx-auto">
        <HeaderBar userName={userData.name} accountNumber={userData.accountNumber} />
        
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
          {/* Left Column - Balance and Actions */}
          <div className="space-y-6 lg:col-span-1">
            <BalanceCard balance={userData.balance} />
            <PayNowButton />
            
            {/* Eco Stats Card */}
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
            <RecentTransactionTable transactions={recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;