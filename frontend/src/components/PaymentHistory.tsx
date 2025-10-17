import React from 'react';

type Record = {
  _id: string;
  date: string;
  paymentType: 'collection_fee' | 'recyclable_payback' | 'other';
  type: 'payment' | 'payback';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
};

type Props = {
  items: Record[];
};

export const PaymentHistory: React.FC<Props> = ({ items }) => {
  if (!items?.length) return <p className="text-sm text-gray-500">No payment records.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(r => (
            <tr key={r._id}>
              <td className="px-3 py-2 text-sm text-gray-700">{new Date(r.date).toLocaleString()}</td>
              <td className="px-3 py-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs ${r.type === 'payment' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {r.type === 'payment' ? 'Collection Fee' : 'Payback'}
                </span>
              </td>
              <td className="px-3 py-2 text-sm font-medium">
                {r.amount < 0 ? `- $${Math.abs(r.amount).toFixed(2)}` : `$${r.amount.toFixed(2)}`}
              </td>
              <td className="px-3 py-2 text-sm text-gray-700">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
