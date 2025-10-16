// typed via inline props; no React namespace import needed
import {
  CalendarIcon,
  CreditCardIcon,
  HashIcon,
  FileTextIcon,
} from 'lucide-react'
export function PaymentDetailsForm({ payment, onPaymentChange }: { payment: any; onPaymentChange: (field: any, value: any) => void }) {
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
    },
    {
      id: 'check',
      name: 'Check',
    },
    {
      id: 'cash',
      name: 'Cash',
    },
    {
      id: 'other',
      name: 'Other',
    },
  ]
  const statusOptions = [
    {
      id: 'draft',
      name: 'Draft',
    },
    {
      id: 'posted',
      name: 'Posted',
    },
    {
      id: 'reconciled',
      name: 'Reconciled',
    },
  ]
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Payment Details</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                value={payment.amount}
                onChange={(e) =>
                  onPaymentChange('amount', parseFloat(e.target.value))
                }
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                id="date"
                className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={payment.date}
                onChange={(e) => onPaymentChange('date', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="method"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CreditCardIcon size={16} className="text-gray-400" />
              </div>
              <select
                id="method"
                name="method"
                className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md"
                value={payment.method}
                onChange={(e) => onPaymentChange('method', e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32] sm:text-sm rounded-md"
              value={payment.status}
              onChange={(e) => onPaymentChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="reference"
              className="block text-sm font-medium text-gray-700"
            >
              Reference Number
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HashIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="reference"
                id="reference"
                className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., BANK-123456"
                value={payment.reference}
                onChange={(e) => onPaymentChange('reference', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-start pt-3 pl-3 pointer-events-none">
              <FileTextIcon size={16} className="text-gray-400" />
            </div>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Add notes about this payment..."
              value={payment.notes}
              onChange={(e) => onPaymentChange('notes', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
