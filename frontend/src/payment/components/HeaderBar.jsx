import React from 'react';

const HeaderBar = ({ userName, accountNumber }) => {
  return (
    <header className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">EcoBinPay Dashboard</h1>
            <p className="text-sm text-gray-600">Sustainable payments for a greener tomorrow</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 space-x-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back</p>
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-green-600">{accountNumber}</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 border-2 border-green-200 rounded-full">
            <span className="text-sm font-semibold text-green-700">
              {userName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative leaves */}
      <div className="flex justify-center mt-4 space-x-8 opacity-20">
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      </div>
    </header>
  );
};

export default HeaderBar;