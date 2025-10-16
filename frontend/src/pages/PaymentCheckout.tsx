import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import { AmountSelector } from '../components/payments/AmountSelector'
import { PaymentMethodTabs } from '../components/payments/PaymentMethodTabs'
import { OrderSummary } from '../components/payments/OrderSummary'

export function PaymentCheckout() {
  const [paymentAmount, setPaymentAmount] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState<number>(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('saved-card')
  const fullAmount = 1250.75
  const handleAmountChange = (type: 'full' | 'partial', amount?: number) => {
    setPaymentAmount(type)
    if (type === 'partial' && amount) {
      setPartialAmount(amount)
    }
  }
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the payment information
    console.log('Payment submitted', {
      amount: paymentAmount === 'full' ? fullAmount : partialAmount,
      paymentMethod: selectedPaymentMethod,
    })
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
          <h1 className="text-3xl font-bold text-[#2E7D32]">
            Payment Checkout
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <AmountSelector
                fullAmount={fullAmount}
                selectedType={paymentAmount}
                partialAmount={partialAmount}
                onAmountChange={handleAmountChange}
              />
              <PaymentMethodTabs
                selectedMethod={selectedPaymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#2E7D32] text-white font-medium rounded-lg hover:bg-[#1B5E20] transition-colors text-lg"
                >
                  Continue to secure payment
                </button>
              </div>
            </div>
            <div className="md:col-span-1">
              <OrderSummary
                fullAmount={fullAmount}
                paymentAmount={paymentAmount}
                partialAmount={partialAmount}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
