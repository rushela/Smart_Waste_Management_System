import React, { useState } from 'react';

interface Filters {
  status: string;
  dateRange: string;
  type: string;
}

interface TransactionFilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  totalTransactions: number;
}

const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({ filters, onFiltersChange, totalTransactions }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'failed', label: 'Failed', color: 'red' }
  ];

  // explicit Tailwind class mappings (avoids dynamic template strings which may be purged)
  const colorClassMap = {
    blue: {
      active: 'bg-blue-500 text-white shadow-md',
      inactive: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    green: {
      active: 'bg-green-500 text-white shadow-md',
      inactive: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    yellow: {
      // yellow uses a darker active background + dark text for readability
      active: 'bg-yellow-400 text-white shadow-md',
      inactive: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    },
    red: {
      active: 'bg-red-500 text-white shadow-md',
      inactive: 'bg-red-100 text-red-700 hover:bg-red-200'
    }
  };

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'payment', label: 'Payments' },
    { value: 'credit', label: 'Credits' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: '2024', label: '2024' }
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      dateRange: 'all',
      type: 'all'
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.dateRange !== 'all' || filters.type !== 'all';

  return (
    <div className="p-6 mb-6 bg-white border border-green-100 shadow-lg rounded-2xl">
      {/* Header */}
      <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 space-x-3 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-800">Transaction Filters</h2>
          <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            {totalTransactions} transactions
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-sm text-gray-600 transition-colors duration-200 hover:text-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Clear All</span>
            </button>
          )}
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors duration-200 bg-green-500 lg:hidden hover:bg-green-600 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Controls - Desktop */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive = filters.status === option.value;
                // Special case yellow (pending) to use darker text for readability instead of white
                const classes = colorClassMap[option.color] || colorClassMap.blue;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? classes.active : classes.inactive}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('type', option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.type === option.value
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('dateRange', option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.dateRange === option.value
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2 space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.status !== 'all' && (
                <span className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  <span>Status: {statusOptions.find(s => s.value === filters.status)?.label}</span>
                  <button onClick={() => handleFilterChange('status', 'all')}>×</button>
                </span>
              )}
              {filters.type !== 'all' && (
                <span className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  <span>Type: {typeOptions.find(t => t.value === filters.type)?.label}</span>
                  <button onClick={() => handleFilterChange('type', 'all')}>×</button>
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                  <span>Date: {dateOptions.find(d => d.value === filters.dateRange)?.label}</span>
                  <button onClick={() => handleFilterChange('dateRange', 'all')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilterBar;