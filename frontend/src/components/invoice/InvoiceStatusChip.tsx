import React from 'react'
interface InvoiceStatusChipProps {
  status: string
}
export const InvoiceStatusChip: React.FC<InvoiceStatusChipProps> = ({
  status,
}) => {
  let bgColor = 'bg-gray-100'
  let textColor = 'text-gray-800'
  switch (status) {
    case 'Paid':
      bgColor = 'bg-green-100'
      textColor = 'text-green-800'
      break
    case 'Partially Paid':
      bgColor = 'bg-blue-100'
      textColor = 'text-blue-800'
      break
    case 'Unpaid':
      bgColor = 'bg-yellow-100'
      textColor = 'text-yellow-800'
      break
    case 'Overdue':
      bgColor = 'bg-red-100'
      textColor = 'text-red-800'
      break
    default:
      break
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  )
}
