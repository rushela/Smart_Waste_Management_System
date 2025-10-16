import React from 'react'
interface AmountSelectorProps {
  fullAmount: number
  selectedType: 'full' | 'partial'
  partialAmount: number
  onAmountChange: (type: 'full' | 'partial', amount?: number) => void
}
export function AmountSelector({
  fullAmount,
  selectedType,
  partialAmount,
  onAmountChange,
}: AmountSelectorProps) {
  const handlePartialAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      onAmountChange('partial', value)
    }
  }
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Payment Amount</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="full-amount"
              name="payment-amount"
              className="w-5 h-5 text-[#2E7D32] border-gray-300 focus:ring-[#2E7D32]"
              checked={selectedType === 'full'}
              onChange={() => onAmountChange('full')}
            />
            <label htmlFor="full-amount" className="block ml-3">
              <span className="text-lg font-medium text-[#263238]">
                Full Amount
              </span>
              <span className="block text-sm text-gray-500">
                Pay the entire balance of ${fullAmount.toLocaleString()}
              </span>
            </label>
          </div>
          <div className="flex items-start">
            <input
              type="radio"
              id="partial-amount"
              name="payment-amount"
              className="w-5 h-5 mt-1.5 text-[#2E7D32] border-gray-300 focus:ring-[#2E7D32]"
              checked={selectedType === 'partial'}
              onChange={() =>
                onAmountChange('partial', partialAmount || fullAmount / 2)
              }
            />
            <label htmlFor="partial-amount" className="block w-full ml-3">
              <span className="text-lg font-medium text-[#263238]">
                Partial Amount
              </span>
              <span className="block mb-2 text-sm text-gray-500">
                Pay any amount between $10 and ${fullAmount.toLocaleString()}
              </span>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="partial-amount"
                  id="partial-amount-input"
                  className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm ${selectedType === 'partial' ? '' : 'opacity-50'}`}
                  placeholder="0.00"
                  aria-describedby="partial-amount-currency"
                  value={partialAmount || ''}
                  onChange={handlePartialAmountChange}
                  min={10}
                  max={fullAmount}
                  step="0.01"
                  disabled={selectedType !== 'partial'}
                  onClick={() => {
                    if (selectedType !== 'partial') {
                      onAmountChange('partial', partialAmount || fullAmount / 2)
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="partial-amount-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
