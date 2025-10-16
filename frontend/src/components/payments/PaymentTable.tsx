import React from 'react'
import { Link } from 'react-router-dom'

export interface PaymentRow {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  status: string
  allocated: number
  unallocated: number
  hasAttachment: boolean
}

export const PaymentTable: React.FC<{ payments: PaymentRow[] }> = ({
  payments,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unallocated</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">${p.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.method}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.reference}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">${(p.allocated || 0).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">${(p.unallocated || 0).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Link to={`/payment-details/${p.id}`} className="text-[#2E7D32] hover:underline">View</Link>
                  <Link to={`/payments/edit/${p.id}`} className="text-[#2E7D32] hover:underline">Edit</Link>
                  <button className="text-red-600 hover:underline" onClick={() => alert('Void action (mock)')}>Void</button>
                </div>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentTable
