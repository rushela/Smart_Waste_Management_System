import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, SaveIcon } from 'lucide-react'
import { PaymentDetailsForm } from '../components/payments/PaymentDetailsForm'
import InvoiceAllocationTable from '../components/payments/InvoiceAllocationTable'
export function PaymentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  type Allocation = {
    invoiceId: string
    invoiceNumber: string
    invoiceDate: string
    invoiceAmount: number
    allocated: number
    remaining: number
  }
  type PaymentState = {
    id: string
    amount: number
    date: string
    method: string
    reference: string
    notes: string
    status: string
    allocations: Allocation[]
  }
  const [payment, setPayment] = useState<PaymentState>({
    id: '',
    amount: 0,
    date: '',
    method: 'bank_transfer',
    reference: '',
    notes: '',
    status: 'draft',
    allocations: [],
  })
  // Mock fetch payment data - in a real app, this would be an API call
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock data for the payment being edited
      const mockPayment: PaymentState = {
        id: id ?? '',
        amount: 825.5,
        date: '2023-10-05',
        method: 'bank_transfer',
        reference: 'BANK-123456',
        notes: 'October payment',
        status: 'posted',
        allocations: [
          {
            invoiceId: 'INV-2023-1028',
            invoiceNumber: 'INV-2023-1028',
            invoiceDate: '2023-10-01',
            invoiceAmount: 1250.75,
            allocated: 500.0,
            remaining: 750.75,
          },
          {
            invoiceId: 'INV-2023-0915',
            invoiceNumber: 'INV-2023-0915',
            invoiceDate: '2023-09-15',
            invoiceAmount: 975.25,
            allocated: 325.5,
            remaining: 649.75,
          },
        ],
      }
      setPayment(mockPayment)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [id])
  const handlePaymentChange = (field: keyof PaymentState, value: any) => {
    setPayment((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleAllocationChange = (allocations: Allocation[]) => {
    setPayment((prev) => ({
      ...prev,
      allocations,
    }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, this would be an API call to update the payment
    console.log('Saving payment:', payment)
    // Show success message and redirect
    alert('Payment updated successfully')
    navigate('/payments')
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            to="/payments"
            className="flex items-center text-[#263238] hover:text-[#2E7D32] mr-4"
          >
            <ArrowLeftIcon size={20} />
            <span className="ml-1">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#2E7D32]">Edit Payment</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <PaymentDetailsForm
            payment={payment}
            onPaymentChange={handlePaymentChange}
          />
          <InvoiceAllocationTable
            paymentAmount={payment.amount}
            allocations={payment.allocations}
            onAllocationsChange={handleAllocationChange}
          />
          <div className="pt-6">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-[#2E7D32] text-white font-medium rounded-lg hover:bg-[#1B5E20] transition-colors text-lg flex items-center justify-center"
            >
              <SaveIcon size={20} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
