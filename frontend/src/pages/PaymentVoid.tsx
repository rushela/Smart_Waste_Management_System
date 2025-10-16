import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangleIcon, XIcon } from 'lucide-react'
// Mock function to get payment data
const getMockPaymentData = (id: string) => ({
  id,
  status: 'Posted',
  amount: 1250.75,
  date: '2023-09-15',
  method: 'Bank Transfer',
  reference: 'INV-2023-0042',
})
const PaymentVoid: React.FC = () => {
  const { id = '' } = useParams<{
    id: string
  }>()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<any>(null)
  const [reason, setReason] = useState('')
  const [isSoftDelete, setIsSoftDelete] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    // In a real app, this would be an API call
    const data = getMockPaymentData(id)
    setPayment(data)
  }, [id])
  const handleCancel = () => {
    navigate(-1)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    setIsSubmitting(true)
    setError('')
    // Simulate API call to void payment
    setTimeout(() => {
      console.log('Voiding payment', {
        paymentId: id,
        reason,
        isSoftDelete,
      })
      // In a real application, we would:
      // 1. Create a reversal entry (negative payment) or mark payment voided=true
      // 2. Release allocations
      // 3. Recompute balances
      // Navigate back to payment history after successful void
      navigate('/payment-history', {
        state: {
          notification: {
            type: 'success',
            message: `Payment ${id} has been successfully voided.`,
          },
        },
      })
    }, 1000)
  }
  if (!payment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    )
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#263238]">
            Void Payment #{id}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-6 bg-[#FEF9E7] border-l-4 border-[#FBC02D] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangleIcon className="h-5 w-5 text-[#FBC02D]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#263238]">
                    <strong>Warning:</strong> Voiding this payment will release
                    all allocations and may affect invoice balances. This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-[#263238]">
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg text-[#263238]">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Method</p>
                  <p className="text-lg text-[#263238]">{payment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference</p>
                  <p className="text-lg text-[#263238]">{payment.reference}</p>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-[#263238] mb-1"
                >
                  Reason for Void <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32] sm:text-sm ${error ? 'border-red-500' : ''}`}
                  rows={3}
                  placeholder="Please provide a reason for voiding this payment"
                  required
                ></textarea>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
              <div className="flex items-center">
                <input
                  id="soft-delete"
                  type="checkbox"
                  checked={isSoftDelete}
                  onChange={(e) => setIsSoftDelete(e.target.checked)}
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                />
                <label
                  htmlFor="soft-delete"
                  className="ml-2 block text-sm text-[#263238]"
                >
                  Soft delete (mark as voided but keep in records)
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end px-6 py-4 space-x-3 rounded-b-lg bg-gray-50">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                'Void Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default PaymentVoid
