import React, { useEffect, useState } from 'react'
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react'
export function InvoiceAllocationTable({
  paymentAmount,
  allocations,
  onAllocationsChange,
}) {
  const [availableAmount, setAvailableAmount] = useState(0)
  const [editingRow, setEditingRow] = useState(null)
  const [editValue, setEditValue] = useState('')
  // Calculate available amount whenever allocations or payment amount changes
  useEffect(() => {
    const totalAllocated = allocations.reduce(
      (sum, item) => sum + item.allocated,
      0,
    )
    setAvailableAmount(paymentAmount - totalAllocated)
  }, [allocations, paymentAmount])
  const startEditing = (index, currentValue) => {
    setEditingRow(index)
    setEditValue(currentValue.toString())
  }
  const handleAllocationChange = (index, newValue) => {
    const numValue = parseFloat(newValue)
    if (isNaN(numValue) || numValue < 0) return
    const currentAllocation = allocations[index].allocated
    const difference = numValue - currentAllocation
    // Don't allow allocating more than available + current allocation
    if (difference > availableAmount) return
    const updatedAllocations = [...allocations]
    updatedAllocations[index] = {
      ...updatedAllocations[index],
      allocated: numValue,
      remaining: updatedAllocations[index].invoiceAmount - numValue,
    }
    onAllocationsChange(updatedAllocations)
    setEditingRow(null)
  }
  const addAllocation = () => {
    // In a real app, this would open a modal to select from available invoices
    alert(
      'In a real app, this would open a dialog to select from available invoices',
    )
  }
  const removeAllocation = (index) => {
    const updatedAllocations = [...allocations]
    updatedAllocations.splice(index, 1)
    onAllocationsChange(updatedAllocations)
  }
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Invoice Allocation</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-white">Available:</span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${availableAmount === 0 ? 'bg-white text-[#2E7D32]' : 'bg-yellow-100 text-yellow-800'}`}
          >
            ${availableAmount.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Invoice
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Allocated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Remaining
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allocations.map((allocation, index) => (
                <tr key={allocation.invoiceId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#263238]">
                    {allocation.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {allocation.invoiceDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    ${allocation.invoiceAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    {editingRow === index ? (
                      <input
                        type="number"
                        className="w-24 px-2 py-1 text-right border rounded focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleAllocationChange(index, editValue)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAllocationChange(index, editValue)
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="font-medium text-[#2E7D32] cursor-pointer hover:underline"
                        onClick={() =>
                          startEditing(index, allocation.allocated)
                        }
                      >
                        ${allocation.allocated.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    ${allocation.remaining.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => removeAllocation(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <MinusCircleIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {allocations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    No invoices allocated. Click "Add Invoice" to allocate this
                    payment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={addAllocation}
            className="flex items-center text-[#2E7D32] hover:text-[#1B5E20] text-sm font-medium"
          >
            <PlusCircleIcon size={18} className="mr-1" />
            Add Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

// Provide a default export for compatibility with files that use default imports
export default InvoiceAllocationTable
