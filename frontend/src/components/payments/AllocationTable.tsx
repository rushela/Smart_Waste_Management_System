import React from 'react'
interface Allocation {
  invoiceNumber: string
  amount: number
  date: string
}
interface AllocationTableProps {
  allocations: Allocation[]
}
export const AllocationTable: React.FC<AllocationTableProps> = ({
  allocations,
}) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg">
      <div className="bg-[#A5D6A7] px-6 py-4">
        <h2 className="text-xl font-semibold text-[#263238]">Allocations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((allocation, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#263238]">
                  {allocation.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(allocation.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#263238]">
                  ${allocation.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#263238]"
                colSpan={2}
              >
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-[#263238]">
                $
                {allocations
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
