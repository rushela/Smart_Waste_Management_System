import React from 'react'
import { InvoiceStatusChip } from './InvoiceStatusChip'
import { EyeIcon } from 'lucide-react'
// Local invoice shape (do not import from pages to avoid circular/type-resolution issues)
interface LocalInvoice {
  id: string
  period: string
  amount: number
  paid: number
  balance: number
  dueDate?: string
  status?: string
}

interface InvoiceTableProps {
  invoices: LocalInvoice[]
  selectedInvoices: string[]
  onSelectInvoice: (id: string) => void
  onSelectAll: (selected: boolean) => void
}
export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  onSelectInvoice,
  onSelectAll,
}) => {
  const allSelected =
    invoices.length > 0 && selectedInvoices.length === invoices.length
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked)
  }
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                  checked={allSelected}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Invoice
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Period
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Paid
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Balance
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`hover:bg-gray-50 ${selectedInvoices.includes(invoice.id) ? 'bg-[#EDF7ED]' : ''}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => onSelectInvoice(invoice.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#263238]">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#263238]">
                    {invoice.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#263238]">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#263238]">
                    ${invoice.paid.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#263238]">
                    ${invoice.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InvoiceStatusChip status={invoice.status || 'Unknown'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="View Invoice"
                    >
                      <EyeIcon className="h-5 w-5 text-[#2E7D32]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
