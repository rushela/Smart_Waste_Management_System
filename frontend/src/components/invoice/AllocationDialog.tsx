import React, { useState, useRef } from 'react'
// Local types to avoid importing from pages
interface Invoice {
  id: string
  period?: string
  amount: number
  paid: number
  balance: number
  dueDate?: string
  status?: string
}
interface UnallocatedPayment {
  id: string
  date: string
  amount: number
  method: string
  reference?: string
  unallocated: number
}
import { XIcon } from 'lucide-react'
interface AllocationDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedInvoices: Invoice[]
  unallocatedPayments: UnallocatedPayment[]
  onComplete: (
    allocations: {
      invoiceId: string
      paymentId: string
      amount: number
    }[],
  ) => void
}
export const AllocationDialog: React.FC<AllocationDialogProps> = ({
  isOpen,
  onClose,
  selectedInvoices,
  unallocatedPayments,
  onComplete,
}) => {
  const [allocations, setAllocations] = useState<{
    [key: string]: {
      paymentId: string
      amount: number
    }
  }>({})
  const [draggingPaymentId, setDraggingPaymentId] = useState<string | null>(
    null,
  )
  // dragAmount was unused; remove to avoid linter warnings
  const dragSourceRef = useRef<HTMLDivElement>(null)
  if (!isOpen) return null
  const handleDragStart = (
    paymentId: string,
    amount: number,
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    setDraggingPaymentId(paymentId)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      // Create a custom drag image
      const dragPreview = document.createElement('div')
      dragPreview.className =
        'bg-white shadow-lg rounded p-2 border border-[#2E7D32]'
      dragPreview.textContent = `$${amount.toFixed(2)}`
      document.body.appendChild(dragPreview)
      e.dataTransfer.setDragImage(dragPreview, 20, 20)
      setTimeout(() => {
        document.body.removeChild(dragPreview)
      }, 0)
    }
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDrop = (
    invoiceId: string,
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault()
    if (!draggingPaymentId) return
    const invoice = selectedInvoices.find((inv) => inv.id === invoiceId)
    if (!invoice) return
    const payment = unallocatedPayments.find(
      (pay) => pay.id === draggingPaymentId,
    )
    if (!payment) return
    // Calculate the amount to allocate (min of balance and available)
    const allocateAmount = Math.min(invoice.balance, payment.unallocated)
    if (allocateAmount <= 0) return
    setAllocations((prev) => ({
      ...prev,
      [invoiceId]: {
        paymentId: draggingPaymentId,
        amount: allocateAmount,
      },
    }))
    setDraggingPaymentId(null)
  }
  const handleAmountChange = (invoiceId: string, amount: number) => {
    const allocation = allocations[invoiceId]
    if (!allocation) return
    const payment = unallocatedPayments.find(
      (pay) => pay.id === allocation.paymentId,
    )
    if (!payment) return
    const invoice = selectedInvoices.find((inv) => inv.id === invoiceId)
    if (!invoice) return
    // Ensure amount doesn't exceed balance or available funds
    const validAmount = Math.min(
      Math.max(0, amount),
      // Not negative
      invoice.balance,
      // Not more than balance
      payment.unallocated, // Not more than available
    )
    setAllocations((prev) => ({
      ...prev,
      [invoiceId]: {
        ...prev[invoiceId],
        amount: validAmount,
      },
    }))
  }
  const handleRemoveAllocation = (invoiceId: string) => {
    setAllocations((prev) => {
      const newAllocations = {
        ...prev,
      }
      delete newAllocations[invoiceId]
      return newAllocations
    })
  }
  const handleComplete = () => {
    const allocationsList = Object.entries(allocations).map(
      ([invoiceId, data]) => ({
        invoiceId,
        paymentId: data.paymentId,
        amount: data.amount,
      }),
    )
    onComplete(allocationsList)
  }
  const totalAllocated = Object.values(allocations).reduce(
    (sum, item) => sum + item.amount,
    0,
  )
  const totalUnallocated = unallocatedPayments.reduce(
    (sum, payment) => sum + payment.unallocated,
    0,
  )
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#263238]">
            Allocate Payments
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left column: Unallocated payments */}
            <div>
              <h3 className="text-lg font-medium text-[#263238] mb-4">
                Unallocated Payments
              </h3>
              {unallocatedPayments.length === 0 ? (
                <div className="p-4 text-center text-gray-500 rounded bg-gray-50">
                  No unallocated payments available
                </div>
              ) : (
                <div className="space-y-3">
                  {unallocatedPayments.map((payment) => (
                    <div
                      key={payment.id}
                      ref={
                        payment.id === draggingPaymentId ? dragSourceRef : null
                      }
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(payment.id, payment.unallocated, e)
                      }
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:border-[#2E7D32] shadow-sm"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{payment.id}</span>
                        <span className="text-[#2E7D32] font-bold">
                          ${payment.unallocated.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          Date: {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div>Method: {payment.method}</div>
                        <div>Reference: {payment.reference}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-3 bg-[#EDF7ED] rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Total Available:</span>
                  <span className="font-bold">
                    ${totalUnallocated.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* Right column: Invoices to allocate to */}
            <div>
              <h3 className="text-lg font-medium text-[#263238] mb-4">
                Selected Invoices
              </h3>
              <div className="space-y-3">
                {selectedInvoices.map((invoice) => {
                  const allocation = allocations[invoice.id]
                  const allocatedAmount = allocation ? allocation.amount : 0
                  const paymentSource = allocation
                    ? unallocatedPayments.find(
                        (p) => p.id === allocation.paymentId,
                      )?.id
                    : null
                  return (
                    <div
                      key={invoice.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(invoice.id, e)}
                      className={`border rounded-lg p-4 ${allocation ? 'bg-[#EDF7ED] border-[#2E7D32]' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{invoice.id}</span>
                        <span className="font-bold">
                          ${invoice.balance.toFixed(2)}
                        </span>
                      </div>
                      {allocation ? (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              From payment:{' '}
                              <span className="font-medium">
                                {paymentSource}
                              </span>
                            </span>
                            <button
                              onClick={() => handleRemoveAllocation(invoice.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm">Amount:</span>
                            <input
                              type="number"
                              value={allocatedAmount}
                              onChange={(e) =>
                                handleAmountChange(
                                  invoice.id,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-24 px-2 py-1 text-right border rounded"
                              min="0"
                              max={Math.min(
                                invoice.balance,
                                allocation
                                  ? unallocatedPayments.find(
                                      (p) => p.id === allocation.paymentId,
                                    )?.unallocated || 0
                                  : 0,
                              )}
                              step="0.01"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 mt-2 text-sm text-center text-gray-500 border border-gray-300 border-dashed rounded bg-gray-50">
                          Drag payment here to allocate
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 p-3 bg-[#EDF7ED] rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Total Allocated:</span>
                  <span className="font-bold">
                    ${totalAllocated.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 space-x-3 rounded-b-lg bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={Object.keys(allocations).length === 0}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${Object.keys(allocations).length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]'}`}
          >
            Complete Allocation
          </button>
        </div>
      </div>
    </div>
  )
}
