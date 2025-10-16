import { Link } from 'react-router-dom'
import { BalanceCard } from '../components/payments/BalanceCard'
import { TransactionsCard } from '../components/payments/TransactionsCard'
import { UnallocatedPaymentsCard } from '../components/payments/UnallocatedPayments'
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  FileTextIcon,
  HistoryIcon,
} from 'lucide-react'
export function PaymentDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-[#263238] hover:text-[#2E7D32] mr-4"
          >
            <ArrowLeftIcon size={20} />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#2E7D32]">
            Payment Dashboard
          </h1>
        </div>
        {/* Outstanding Balance Card */}
        <div className="mb-6">
          <BalanceCard />
        </div>
        {/* Primary CTAs */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <Link
            to="/invoices"
            className="flex items-center justify-center p-4 bg-[#2E7D32] text-white font-medium rounded-lg hover:bg-[#1B5E20] transition-colors"
          >
            <PlusCircleIcon size={20} className="mr-2" />
            Record Payment
          </Link>
          <Link
            to="/invoices"
            className="flex items-center justify-center p-4 bg-white border border-[#2E7D32] text-[#2E7D32] font-medium rounded-lg hover:bg-[#A5D6A7] hover:bg-opacity-20 transition-colors"
          >
            <FileTextIcon size={20} className="mr-2" />
            View Invoices
          </Link>
          <Link
            to="/payment-history"
            className="flex items-center justify-center p-4 bg-white border border-[#2E7D32] text-[#2E7D32] font-medium rounded-lg hover:bg-[#A5D6A7] hover:bg-opacity-20 transition-colors"
          >
            <HistoryIcon size={20} className="mr-2" />
            Payment History
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column - Transactions */}
          <div className="lg:col-span-2">
            <TransactionsCard />
          </div>
          {/* Side column - Unallocated Payments */}
          <div className="space-y-6">
            <UnallocatedPaymentsCard />
            <div className="bg-[#A5D6A7] bg-opacity-20 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-[#2E7D32] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/payments/checkout"
                    className="text-[#2E7D32] hover:underline font-medium flex items-center"
                  >
                    Make a payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[#2E7D32] hover:underline font-medium flex items-center"
                  >
                    Download payment receipt
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[#2E7D32] hover:underline font-medium flex items-center"
                  >
                    Contact billing support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
