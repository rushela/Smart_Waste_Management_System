import { CreditCardIcon, PlusCircleIcon } from 'lucide-react'
export function PaymentMethodsCard() {
  // Mock data - in a real app, this would come from an API
  const paymentMethods = [
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
      <div className="bg-[#2E7D32] px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
        <button className="text-white hover:text-[#A5D6A7]">
          <PlusCircleIcon size={20} />
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center p-4 rounded-lg border ${method.isDefault ? 'border-[#2E7D32] bg-[#A5D6A7] bg-opacity-10' : 'border-gray-200'}`}
            >
              <div className="flex-shrink-0 mr-4">
                <CreditCardIcon size={24} className="text-[#263238]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-[#263238] capitalize">
                    {method.type} •••• {method.last4}
                  </p>
                  {method.isDefault && (
                    <span className="text-xs font-medium text-[#2E7D32] bg-[#A5D6A7] bg-opacity-30 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Expires {method.expiry}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 border border-[#2E7D32] text-[#2E7D32] font-medium rounded-lg hover:bg-[#A5D6A7] hover:bg-opacity-20 transition-colors flex justify-center items-center">
          <PlusCircleIcon size={18} className="mr-2" />
          Add Payment Method
        </button>
      </div>
    </div>
  )
}
