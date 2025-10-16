import { useState } from 'react'
import { CreditCardIcon, PlusCircleIcon, LockIcon } from 'lucide-react'
interface PaymentMethodTabsProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}
export function PaymentMethodTabs({
  selectedMethod,
  onMethodChange,
}: PaymentMethodTabsProps) {
  const [cvv, setCvv] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  // Mock data for saved cards - in a real app, this would come from an API
  const savedCards = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '04/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '5555',
      expiry: '09/24',
      isDefault: false,
    },
  ]
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="bg-[#2E7D32] px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Payment Method</h2>
      </div>
      <div className="p-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => onMethodChange('saved-card')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedMethod === 'saved-card' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Saved Cards
            </button>
            <button
              onClick={() => onMethodChange('new-card')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedMethod === 'new-card' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              New Card
            </button>
            <button
              onClick={() => onMethodChange('bank')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${selectedMethod === 'bank' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Bank Transfer
            </button>
          </nav>
        </div>
        <div className="pt-6">
          {selectedMethod === 'saved-card' && (
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div key={card.id} className="flex items-start">
                  <input
                    id={`card-${card.id}`}
                    name="payment-card"
                    type="radio"
                    className="w-5 h-5 mt-1 text-[#2E7D32] border-gray-300 focus:ring-[#2E7D32]"
                    defaultChecked={card.isDefault}
                  />
                  <label
                    htmlFor={`card-${card.id}`}
                    className="block w-full ml-3"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <CreditCardIcon
                          size={20}
                          className="text-[#263238] mr-2"
                        />
                        <span className="font-medium text-[#263238] capitalize">
                          {card.type} •••• {card.last4}
                        </span>
                      </div>
                      {card.isDefault && (
                        <span className="text-xs font-medium text-[#2E7D32] bg-[#A5D6A7] bg-opacity-30 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Expires {card.expiry}
                    </p>
                    <div className="max-w-xs mt-3">
                      <label
                        htmlFor={`cvv-${card.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV Code
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="password"
                          name={`cvv-${card.id}`}
                          id={`cvv-${card.id}`}
                          className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-3 pr-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="123"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <LockIcon size={16} className="text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        3 or 4 digit security code on the back of your card
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
          {selectedMethod === 'new-card' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="card-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CreditCardIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="card-number"
                    id="card-number"
                    className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="card-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name on Card
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="card-name"
                    id="card-name"
                    className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="expiry-date"
                      id="expiry-date"
                      className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CVV
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="password"
                      name="cvv"
                      id="cvv"
                      className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <LockIcon size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input
                  id="save-card"
                  name="save-card"
                  type="checkbox"
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                />
                <label
                  htmlFor="save-card"
                  className="block ml-2 text-sm text-gray-700"
                >
                  Save this card for future payments
                </label>
              </div>
            </div>
          )}
          {selectedMethod === 'bank' && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <PlusCircleIcon size={20} className="text-[#2E7D32] mr-2" />
                <span className="text-sm font-medium">ACH Bank Transfer</span>
              </div>
              <div>
                <label
                  htmlFor="account-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="account-number"
                    id="account-number"
                    className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="000000000000"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="routing-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Routing Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="routing-number"
                    id="routing-number"
                    className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="000000000"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="account-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Holder Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="account-name"
                    id="account-name"
                    className="focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="John Doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input
                  id="save-bank"
                  name="save-bank"
                  type="checkbox"
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                />
                <label
                  htmlFor="save-bank"
                  className="block ml-2 text-sm text-gray-700"
                >
                  Save this bank account for future payments
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
