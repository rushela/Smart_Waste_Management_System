import React from 'react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="relative p-6 overflow-hidden text-white shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-green-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 bg-green-300 rounded-full opacity-20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold opacity-90">Current Balance</h2>
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full bg-opacity-20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        
        <div className="mb-2">
          <p className={`text-3xl font-bold ${isPositive ? 'text-white' : 'text-yellow-200'}`}>
            {isPositive ? '$' : '-$'}{Math.abs(balance).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-green-100">
            {isPositive ? 'Credit Available' : 'Payment Due'}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-green-400 border-opacity-30">
          <div className="text-center">
            <p className="text-xs opacity-75">Due Date</p>
            <p className="text-sm font-semibold">Jan 30, 2024</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-75">Min. Payment</p>
            <p className="text-sm font-semibold">$25.00</p>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="relative z-10 mt-4">
        <div className="w-full h-2 bg-green-700 rounded-full bg-opacity-40">
          <div 
            className="h-2 transition-all duration-500 bg-yellow-400 rounded-full"
            style={{ width: `${Math.min((balance / 300) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-right text-green-100">
          Credit utilization: {Math.min(Math.round((balance / 300) * 100), 100)}%
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;