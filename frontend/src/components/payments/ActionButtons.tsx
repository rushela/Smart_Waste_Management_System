import React from 'react'
import { EditIcon, XIcon, DownloadIcon, MailIcon } from 'lucide-react'
export const ActionButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-end gap-4">
      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]">
        <EditIcon className="w-4 h-4 mr-2" />
        Edit
      </button>
      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FBC02D] hover:bg-[#F9A825] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FBC02D]">
        <XIcon className="w-4 h-4 mr-2" />
        Void
      </button>
      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]">
        <DownloadIcon className="w-4 h-4 mr-2" />
        Download Receipt
      </button>
      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E7D32] hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]">
        <MailIcon className="w-4 h-4 mr-2" />
        Email Receipt
      </button>
    </div>
  )
}
