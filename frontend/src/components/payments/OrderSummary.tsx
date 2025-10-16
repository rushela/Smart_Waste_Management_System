import React from 'react'
import { ShieldCheckIcon } from 'lucide-react'
interface OrderSummaryProps {
  fullAmount: number
  paymentAmount: 'full' | 'partial'
  partialAmount: number
}
export function OrderSummary({
  fullAmount,
  paymentAmount,
  partialAmount,
}: OrderSummaryProps) {
  const currentAmount = paymentAmount === 'full' ? fullAmount : partialAmount
  const remainingBalance =
    paymentAmount === 'partial' ? fullAmount - partialAmount : 0
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Order Summary</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-[#263238]">
              Invoice #INV-2023-1028
            </h3>
            <p className="text-sm text-gray-500">
              Billing period: Oct 1 - Oct 31, 2023
            </p>
          </div>
          <div className="py-4 border-b border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Subscription fee</span>
              <span className="text-sm font-medium">
                ${(fullAmount * 0.9).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Usage fee</span>
              <span className="text-sm font-medium">
                ${(fullAmount * 0.1).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Taxes</span>
              <span className="text-sm font-medium">$0.00</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium text-gray-900">
                Total due
              </span>
              <span className="text-lg font-bold text-[#263238]">
                ${fullAmount.toFixed(2)}
              </span>
            </div>
            {paymentAmount === 'partial' && partialAmount > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-[#2E7D32]">
                    Payment amount
                  </span>
                  <span className="text-lg font-bold text-[#2E7D32]">
                    ${partialAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Remaining balance
                  </span>
                  <span className="text-sm font-medium">
                    ${remainingBalance.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center p-4 mt-6 rounded-lg bg-gray-50">
          <ShieldCheckIcon
            size={20}
            className="text-[#2E7D32] mr-2 flex-shrink-0"
          />
          <p className="text-xs text-gray-600">
            Your payment is secured with industry-standard encryption. We do not
            store your full card details.
          </p>
        </div>
      </div>
    </div>
  )
}
