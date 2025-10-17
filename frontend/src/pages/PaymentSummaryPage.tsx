import React from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PaymentSummaryPage: React.FC = () => {
  const [totals, setTotals] = React.useState<any[]>([]);
  const [outstanding, setOutstanding] = React.useState(0);

  const load = async () => {
    const res = await api.get('/payments/summary');
    setTotals(res.data.totals || []);
    setOutstanding(res.data.outstanding || 0);
  };
  React.useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Payment Summary</h2>
      <div className="bg-white p-4 rounded border">
        <p className="text-sm text-gray-700">Outstanding: ${outstanding.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded border" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={totals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2ECC71" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
