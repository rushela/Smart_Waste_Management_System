import React, { useState } from 'react'
import { FileIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react'
interface Attachment {
  id: string
  name: string
  url: string
}
interface AttachmentViewerProps {
  attachments: Attachment[]
}
export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  attachments,
}) => {
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(attachments.length > 0 ? attachments[0] : null)
  return (
    <div className="overflow-hidden bg-white rounded-lg">
      <div className="bg-[#A5D6A7] px-6 py-4">
        <h2 className="text-xl font-semibold text-[#263238]">Attachments</h2>
      </div>
      {attachments.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No attachments available for this payment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  onClick={() => setSelectedAttachment(attachment)}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer
                    ${selectedAttachment?.id === attachment.id ? 'bg-gray-100 border border-gray-300' : 'hover:bg-gray-50'}
                  `}
                >
                  <FileIcon className="h-5 w-5 text-[#2E7D32] mr-2" />
                  <span className="text-sm text-[#263238] truncate">
                    {attachment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden border rounded-lg md:col-span-2">
            {selectedAttachment && (
              <div>
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <span className="font-medium text-[#263238]">
                    {selectedAttachment.name}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded-full hover:bg-gray-200">
                      <DownloadIcon className="h-4 w-4 text-[#2E7D32]" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-200">
                      <ExternalLinkIcon className="h-4 w-4 text-[#2E7D32]" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <img
                    src={selectedAttachment.url}
                    alt={selectedAttachment.name}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
