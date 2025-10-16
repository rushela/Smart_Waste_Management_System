import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportService } from '../services/api';
import { format } from 'date-fns';

export const PaymentReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await reportService.getPayments(params);
      setPaymentData(res.data.data);
    } catch (err) {
      console.error('Error fetching payment reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchPaymentData();
  };

  const getTotalIncome = () => {
    if (!paymentData?.totals) return 0;
    const payment = paymentData.totals.find((t: any) => t.type === 'payment');
    return payment?.total || 0;
  };

  const getTotalPaybacks = () => {
    if (!paymentData?.totals) return 0;
    const payback = paymentData.totals.find((t: any) => t.type === 'payback');
    return payback?.total || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payment Reports</h2>
        <button
          onClick={() => reportService.exportExcel()}
          className="flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${getTotalIncome().toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paybacks</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${getTotalPaybacks().toFixed(2)}</p>
                </div>
                <div className="bg-[#FF8C42]/10 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-[#FF8C42]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    ${(paymentData?.outstanding || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Chart */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
            {paymentData?.totals && paymentData.totals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentData.totals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#2ECC71" name="Amount ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500 py-8">No payment data available</p>
            )}
          </div>

          {/* Payment Details Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentData?.totals?.map((payment: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.type === 'payment' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {payment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!paymentData?.totals || paymentData.totals.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No payment records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
