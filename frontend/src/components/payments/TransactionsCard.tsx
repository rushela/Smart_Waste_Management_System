import { useEffect, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import paymentsAPI from '../../api/payments.api.js'
export function TransactionsCard() {
  const [transactions, setTransactions] = useState<any[]>([])
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await paymentsAPI.listMine({ limit: 5 })
        if (!mounted) return
        const data = Array.isArray(res?.data) ? res.data : []
        const tx = data.map((p: any) => ({
          id: p.id || p._id || String(Math.random()),
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
          amount: Number(p.amount) || 0,
          type: 'payment',
          status: String(p.status || '').toLowerCase(),
        }))
        setTransactions(tx)
      } catch (e) {
        console.error('Failed to load transactions', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={16} className="text-[#2E7D32]" />
      case 'pending':
        return <ClockIcon size={16} className="text-[#FBC02D]" />
      case 'failed':
        return <XCircleIcon size={16} className="text-red-500" />
      default:
        return null
    }
  }
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Recent Transactions
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100">
                  <td className="px-4 py-4 text-sm text-[#263238]">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {transaction.type === 'payment' ? (
                        <ArrowUpIcon
                          size={16}
                          className="text-[#2E7D32] mr-2"
                        />
                      ) : (
                        <ArrowDownIcon
                          size={16}
                          className="text-[#FBC02D] mr-2"
                        />
                      )}
                      <span className="text-sm font-medium text-[#263238] capitalize">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-[#263238]">
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 text-sm font-medium text-[#263238] capitalize">
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <Link to="#" className="text-[#2E7D32] hover:underline font-medium">
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  )
}
