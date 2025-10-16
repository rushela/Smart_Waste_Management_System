import React, { useEffect, useState } from 'react'
import { InvoiceTable } from '../components/invoice/InvoiceTable'
import { AllocationDialog } from '../components/invoice/AllocationDialog'
import { PlusIcon } from 'lucide-react'
// Mock data - would normally come from an API
const getMockInvoices = () => [
  {
    id: 'INV-2023-0042',
    period: '2023-09',
    amount: 1500.0,
    paid: 1250.75,
    balance: 249.25,
    dueDate: '2023-10-15',
    status: 'Partially Paid',
  },
  {
    id: 'INV-2023-0039',
    period: '2023-08',
    amount: 750.5,
    paid: 750.5,
    balance: 0,
    dueDate: '2023-09-15',
    status: 'Paid',
  },
  {
    id: 'INV-2023-0036',
    period: '2023-08',
    amount: 2500.0,
    paid: 2000.0,
    balance: 500.0,
    dueDate: '2023-09-10',
    status: 'Partially Paid',
  },
  {
    id: 'INV-2023-0034',
    period: '2023-07',
    amount: 1800.25,
    paid: 1800.25,
    balance: 0,
    dueDate: '2023-08-28',
    status: 'Paid',
  },
  {
    id: 'INV-2023-0030',
    period: '2023-07',
    amount: 950.0,
    paid: 0,
    balance: 950.0,
    dueDate: '2023-08-20',
    status: 'Unpaid',
  },
  {
    id: 'INV-2023-0027',
    period: '2023-06',
    amount: 3200.5,
    paid: 0,
    balance: 3200.5,
    dueDate: '2023-07-15',
    status: 'Overdue',
  },
  {
    id: 'INV-2023-0025',
    period: '2023-06',
    amount: 1750.75,
    paid: 0,
    balance: 1750.75,
    dueDate: '2023-07-10',
    status: 'Overdue',
  },
]
// Mock unallocated payments
const getMockUnallocatedPayments = () => [
  {
    id: 'P003',
    date: '2023-09-05',
    amount: 2500.0,
    method: 'Check',
    reference: 'INV-2023-0036',
    unallocated: 500.0,
  },
  {
    id: 'P005',
    date: '2023-08-20',
    amount: 950.0,
    method: 'Credit Card',
    reference: 'INV-2023-0030',
    unallocated: 950.0,
  },
  {
    id: 'P007',
    date: '2023-08-10',
    amount: 1750.75,
    method: 'Check',
    reference: 'INV-2023-0025',
    unallocated: 250.75,
  },
]
export interface Invoice {
  id: string
  period: string
  amount: number
  paid: number
  balance: number
  dueDate: string
  status: string
}
export interface UnallocatedPayment {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  unallocated: number
}
const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [unallocatedPayments, setUnallocatedPayments] = useState<
    UnallocatedPayment[]
  >([])
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false)
  useEffect(() => {
    // Simulating API calls
    const invoiceData = getMockInvoices()
    const paymentData = getMockUnallocatedPayments()
    setInvoices(invoiceData)
    setUnallocatedPayments(paymentData)
  }, [])
  const handleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prev) => {
      if (prev.includes(invoiceId)) {
        return prev.filter((id) => id !== invoiceId)
      } else {
        return [...prev, invoiceId]
      }
    })
  }
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = invoices.map((invoice) => invoice.id)
      setSelectedInvoices(allIds)
    } else {
      setSelectedInvoices([])
    }
  }
  const handleAllocation = () => {
    if (selectedInvoices.length === 0) {
      alert('Please select at least one invoice to allocate payments.')
      return
    }
    setIsAllocationDialogOpen(true)
  }
  const handleAllocationComplete = (
    allocations: {
      invoiceId: string
      paymentId: string
      amount: number
    }[],
  ) => {
    // In a real app, this would call an API to update allocations
    console.log('Allocations to process:', allocations)
    // Update local state to reflect the allocations
    const updatedInvoices = [...invoices]
    const updatedPayments = [...unallocatedPayments]
    allocations.forEach((allocation) => {
      // Update invoice paid amount and balance
      const invoiceIndex = updatedInvoices.findIndex(
        (inv) => inv.id === allocation.invoiceId,
      )
      if (invoiceIndex >= 0) {
        updatedInvoices[invoiceIndex].paid += allocation.amount
        updatedInvoices[invoiceIndex].balance -= allocation.amount
        // Update status if fully paid
        if (updatedInvoices[invoiceIndex].balance <= 0) {
          updatedInvoices[invoiceIndex].status = 'Paid'
        } else {
          updatedInvoices[invoiceIndex].status = 'Partially Paid'
        }
      }
      // Update payment unallocated amount
      const paymentIndex = updatedPayments.findIndex(
        (pay) => pay.id === allocation.paymentId,
      )
      if (paymentIndex >= 0) {
        updatedPayments[paymentIndex].unallocated -= allocation.amount
      }
    })
    // Remove payments with no unallocated amount
    const filteredPayments = updatedPayments.filter(
      (payment) => payment.unallocated > 0,
    )
    setInvoices(updatedInvoices)
    setUnallocatedPayments(filteredPayments)
    setIsAllocationDialogOpen(false)
    setSelectedInvoices([])
  }
  const totalSelected = selectedInvoices.length
  const totalBalance =
    selectedInvoices.length > 0
      ? invoices
          .filter((inv) => selectedInvoices.includes(inv.id))
          .reduce((sum, inv) => sum + inv.balance, 0)
      : 0
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#263238]">Invoices</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleAllocation}
              disabled={selectedInvoices.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedInvoices.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]'}`}
            >
              Allocate Payments
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Invoice
            </button>
          </div>
        </div>
        {selectedInvoices.length > 0 && (
          <div className="bg-[#A5D6A7] rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="font-medium">
                {totalSelected} invoice{totalSelected !== 1 ? 's' : ''} selected
              </span>
              <span className="mx-2">|</span>
              <span className="font-medium">
                Total balance: ${totalBalance.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setSelectedInvoices([])}
              className="text-[#1B5E20] hover:underline"
            >
              Clear Selection
            </button>
          </div>
        )}
        <InvoiceTable
          invoices={invoices}
          selectedInvoices={selectedInvoices}
          onSelectInvoice={handleInvoiceSelection}
          onSelectAll={handleSelectAll}
        />
      </div>
      <AllocationDialog
        isOpen={isAllocationDialogOpen}
        onClose={() => setIsAllocationDialogOpen(false)}
        selectedInvoices={invoices.filter((inv) =>
          selectedInvoices.includes(inv.id),
        )}
        unallocatedPayments={unallocatedPayments}
        onComplete={handleAllocationComplete}
      />
    </div>
  )
}
export default InvoiceList
