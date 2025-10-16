import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PaymentHeader } from '../components/payments/PaymentHeader'
import { AllocationTable } from '../components/payments/AllocationTable'
import { AttachmentViewer } from '../components/payments/AttachmentViewer'
import { AuditLog } from '../components/payments/AuditLog'
import { ActionButtons } from '../components/payments/ActionButtons'
// Mock data - would normally come from an API
const getMockPaymentData = (id: string) => ({
  id,
  status: 'Posted',
  amount: 1250.75,
  date: '2023-09-15',
  method: 'Bank Transfer',
  reference: 'INV-2023-0042',
  allocations: [
    {
      invoiceNumber: 'INV-2023-0042',
      amount: 750.5,
      date: '2023-09-01',
    },
    {
      invoiceNumber: 'INV-2023-0036',
      amount: 500.25,
      date: '2023-08-25',
    },
  ],
  attachments: [
    {
      id: '1',
      name: 'Payment Slip.pdf',
      url: 'https://source.unsplash.com/random/800x600/?document',
    },
  ],
  auditLog: [
    {
      action: 'Created',
      user: 'John Doe',
      timestamp: '2023-09-15 09:23:45',
    },
    {
      action: 'Updated',
      user: 'Jane Smith',
      timestamp: '2023-09-15 14:17:32',
    },
  ],
})
const PaymentDetails: React.FC = () => {
  const { id = '' } = useParams<{
    id: string
  }>()
  const [activeTab, setActiveTab] = useState<string>('allocations')
  const paymentData = getMockPaymentData(id)
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <PaymentHeader payment={paymentData} />
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              {['allocations', 'attachments', 'audit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-6">
            {activeTab === 'allocations' && (
              <AllocationTable allocations={paymentData.allocations} />
            )}
            {activeTab === 'attachments' && (
              <AttachmentViewer attachments={paymentData.attachments} />
            )}
            {activeTab === 'audit' && <AuditLog logs={paymentData.auditLog} />}
          </div>
        </div>
        <div className="mt-8">
          <ActionButtons />
        </div>
      </div>
    </div>
  )
}
export default PaymentDetails
