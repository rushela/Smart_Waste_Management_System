import { useEffect, useState } from 'react'
import { AlertCircleIcon, ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import paymentsAPI from '../../api/payments.api.js'

export function UnallocatedPaymentsCard() {
  const [unallocatedPayments, setUnallocatedPayments] = useState<any[]>([])
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await paymentsAPI.listMine({ limit: 100 })
        if (!mounted) return
        const data: any[] = Array.isArray(res?.data) ? res.data : []
        // approximate unallocated as payments with status PENDING or DRAFT
        const unallocated = data
          .filter((p: any) => String(p.status).toUpperCase() !== 'PAID')
          .map((p: any) => ({ id: String(p.id), date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '', amount: Number(p.amount) || 0, reference: p.gatewayRef || '' }))
        setUnallocatedPayments(unallocated)
      } catch (e) {
        console.error('Failed to load unallocated payments', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])
  const totalUnallocated = unallocatedPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Unallocated Payments
        </h2>
      </div>
      <div className="p-6">
        {unallocatedPayments.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Total Unallocated
              </span>
              <span className="text-lg font-bold text-[#2E7D32]">
                ${totalUnallocated.toFixed(2)}
              </span>
            </div>
            <div className="space-y-3">
              {unallocatedPayments.map((payment) => (
                <div key={payment.id} className="bg-[#F1F8E9] p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#263238]">
                      {payment.date}
                    </span>
                    <span className="text-sm font-bold text-[#2E7D32]">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Reference: {payment.reference}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="#"
                className="text-sm text-[#2E7D32] hover:underline font-medium flex items-center justify-center"
              >
                Allocate payments
                <ArrowRightIcon size={16} className="ml-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircleIcon size={24} className="mb-2 text-gray-400" />
            <p className="text-gray-500">No unallocated payments</p>
            <p className="mt-1 text-xs text-gray-400">
              All your payments have been allocated to invoices
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
