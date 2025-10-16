import { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import paymentsAPI from '../../api/payments.api.js'

export function BalanceCard() {
  const [balance, setBalance] = useState<number>(0)
  const [dueDate, setDueDate] = useState<string>('')
  const [daysRemaining, setDaysRemaining] = useState<number>(0)
  const [billingModel] = useState<string>('Monthly')
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await paymentsAPI.listMine({ limit: 100 })
        if (!mounted) return
        const data: any[] = Array.isArray(res?.data) ? res.data : []
        const outstanding = data
          .filter((p: any) => String(p.status).toUpperCase() === 'PENDING')
          .reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0)
        setBalance(outstanding)
        // keep simple defaults for due date and days remaining in dev
        setDueDate('October 15, 2023')
        setDaysRemaining(5)
      } catch (e) {
        console.error('Failed to load balance', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])
  return (
    <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Outstanding Balance
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-4xl font-bold text-[#263238]">
              ${balance.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <CalendarIcon size={16} className="mr-1 text-gray-500" />
              <p className="text-sm text-gray-600">Due on {dueDate}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center bg-[#FBC02D] bg-opacity-20 px-3 py-1 rounded-full">
              <ClockIcon size={16} className="text-[#FBC02D] mr-1" />
              <span className="text-sm font-medium text-[#263238]">
                {daysRemaining} days remaining
              </span>
            </div>
            <div className="inline-flex items-center bg-[#A5D6A7] bg-opacity-20 px-3 py-1 rounded-full ml-2">
              <TagIcon size={16} className="text-[#2E7D32] mr-1" />
              <span className="text-sm font-medium text-[#263238]">
                {billingModel}
              </span>
            </div>
          </div>
        </div>
        <Link
          to="/checkout"
          className="w-full sm:w-auto px-6 py-3 bg-[#2E7D32] text-white font-medium rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          Pay Now
        </Link>
      </div>
    </div>
  )
}
