import React from 'react'
interface StatusChipProps {
  status: string
}
export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-200 text-gray-800'
      case 'posted':
        return 'bg-[#2E7D32] text-white'
      case 'reconciled':
        return 'bg-blue-500 text-white'
      case 'voided':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }
  return (
    <div
      className={`${getStatusColor()} px-4 py-2 rounded-full font-medium text-sm inline-flex items-center`}
    >
      <span className="w-2 h-2 mr-2 bg-current rounded-full opacity-75"></span>
      {status}
    </div>
  )
}
