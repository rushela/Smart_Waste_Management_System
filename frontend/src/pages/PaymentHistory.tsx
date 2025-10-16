import React, { useEffect, useState } from 'react'
import { PaymentFilters } from '../components/payments/PaymentFilters'
import PaymentTable from '../components/payments/PaymentTable'
import { DownloadIcon } from 'lucide-react'
import paymentsAPI from '../api/payments.api.js'
export interface Payment {
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
export interface FilterValues {
  dateFrom: string
  dateTo: string
  method: string
  status: string
  amountMin: string
  amountMax: string
  hasAttachment: boolean
}
const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [filters, setFilters] = useState<FilterValues>({
    dateFrom: '',
    dateTo: '',
    method: '',
    status: '',
    amountMin: '',
    amountMax: '',
    hasAttachment: false,
  })
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await paymentsAPI.listMine({ limit: 200 })
        if (!mounted) return
        const data = Array.isArray(res?.data) ? res.data : []
        // normalize createdAt -> date string for table
        const paymentsWithDate = data.map((p: any) => ({
          id: String(p.id),
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
          amount: Number(p.amount) || 0,
          method: p.gateway || 'N/A',
          reference: p.gatewayRef || '',
          status: p.status || '',
          allocated: 0,
          unallocated: 0,
          hasAttachment: false,
        }))
        setPayments(paymentsWithDate)
        setFilteredPayments(paymentsWithDate)
      } catch (e) {
        console.error('Failed to load payments', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    // Apply filters
    const filtered = payments.filter((payment) => {
      // Date From filter
      if (newFilters.dateFrom && payment.date < newFilters.dateFrom) {
        return false
      }
      // Date To filter
      if (newFilters.dateTo && payment.date > newFilters.dateTo) {
        return false
      }
      // Method filter
      if (newFilters.method && payment.method !== newFilters.method) {
        return false
      }
      // Status filter
      if (newFilters.status && payment.status !== newFilters.status) {
        return false
      }
      // Amount Min filter
      if (
        newFilters.amountMin &&
        payment.amount < parseFloat(newFilters.amountMin)
      ) {
        return false
      }
      // Amount Max filter
      if (
        newFilters.amountMax &&
        payment.amount > parseFloat(newFilters.amountMax)
      ) {
        return false
      }
      // Has Attachment filter
      if (newFilters.hasAttachment && !payment.hasAttachment) {
        return false
      }
      return true
    })
    setFilteredPayments(filtered)
  }
  const handleExportCSV = () => {
    // In a real application, this would generate and download a CSV file
    // For now, we'll just log a message
    console.log('Exporting CSV with', filteredPayments.length, 'payments')
    alert('CSV Export initiated (mock functionality)')
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#263238]">Payment History</h1>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
        <div className="bg-[#A5D6A7] rounded-lg p-6 mb-6">
          <PaymentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <PaymentTable payments={filteredPayments} />
      </div>
    </div>
  )
}
export default PaymentHistory
