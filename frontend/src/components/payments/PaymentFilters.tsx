import React, { useEffect, useState } from 'react'
import { FilterValues } from '../../types/payments'
import { FilterIcon } from 'lucide-react'
interface PaymentFiltersProps {
  filters: FilterValues
  onFilterChange: (filters: FilterValues) => void
}
export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters)
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setLocalFilters((prev: FilterValues) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }
  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }
  const handleResetFilters = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      method: '',
      status: '',
      amountMin: '',
      amountMax: '',
      hasAttachment: false,
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }
  return (
    <div>
      <div className="flex items-center mb-4">
        <FilterIcon className="h-5 w-5 text-[#2E7D32] mr-2" />
        <h2 className="text-xl font-semibold text-[#263238]">Filters</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-[#263238] mb-1">
            Date Range
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="date"
                name="dateFrom"
                value={localFilters.dateFrom}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
                placeholder="From"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                name="dateTo"
                value={localFilters.dateTo}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
                placeholder="To"
              />
            </div>
          </div>
        </div>
        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-[#263238] mb-1">
            Payment Method
          </label>
          <select
            name="method"
            value={localFilters.method}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
          >
            <option value="">All Methods</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Check">Check</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[#263238] mb-1">
            Status
          </label>
          <select
            name="status"
            value={localFilters.status}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Posted">Posted</option>
            <option value="Reconciled">Reconciled</option>
            <option value="Voided">Voided</option>
          </select>
        </div>
        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-[#263238] mb-1">
            Amount Range
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                name="amountMin"
                value={localFilters.amountMin}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="amountMax"
                value={localFilters.amountMax}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        {/* Has Attachment */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="hasAttachment"
            checked={localFilters.hasAttachment}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-[#263238]">
            Has Attachment
          </label>
        </div>
        {/* Filter Buttons */}
        <div className="flex items-end space-x-4">
          <button
            onClick={handleApplyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
