import React from 'react'
import { StatusChip } from './StatusChips'
import { CalendarIcon, CreditCardIcon, HashIcon } from 'lucide-react'
interface PaymentHeaderProps {
  payment: {
    id: string
    status: string
    amount: number
    date: string
    method: string
    reference: string
  }
}
export const PaymentHeader: React.FC<PaymentHeaderProps> = ({ payment }) => {
  return (
    <div className="bg-[#A5D6A7] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#263238]">
          Payment #{payment.id}
        </h1>
        <StatusChip status={payment.status} />
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        <div className="flex items-center">
          <div className="text-4xl font-bold text-[#263238]">
            ${payment.amount.toFixed(2)}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-[#2E7D32] mr-2" />
            <span className="text-[#263238]">
              {new Date(payment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-[#2E7D32] mr-2" />
            <span className="text-[#263238]">{payment.method}</span>
          </div>
          <div className="flex items-center">
            <HashIcon className="h-5 w-5 text-[#2E7D32] mr-2" />
            <span className="text-[#263238]">
              Reference: {payment.reference}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
