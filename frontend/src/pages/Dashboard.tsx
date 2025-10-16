import React, { useEffect, useState } from 'react';
import { TrendingUp, Trash2, DollarSign, AlertCircle, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportService } from '../services/api';

const COLORS = ['#2ECC71', '#FF8C42', '#3498db', '#9b59b6', '#e74c3c'];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState({
    totalWaste: 0,
    totalPickups: 0,
    totalIncome: 0,
    outstandingBills: 0,
  });
  const [wasteByArea, setWasteByArea] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [wasteByType, setWasteByType] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get last 30 days
      const to = new Date().toISOString();
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch summary data
      const summaryRes = await reportService.getSummary({ from, to });
      const summaryData = summaryRes.data.data || [];

      // Calculate KPIs
      const totalWaste = summaryData.reduce((sum: number, item: any) => sum + item.areaWasteTotal, 0);
      const totalPickups = summaryData.reduce((sum: number, item: any) => sum + item.count, 0);

      // Group by area for chart
      const areaMap = new Map();
      summaryData.forEach((item: any) => {
        const existing = areaMap.get(item.area) || 0;
        areaMap.set(item.area, existing + item.areaWasteTotal);
      });
      const byArea = Array.from(areaMap.entries()).map(([area, weight]) => ({
        area,
        weight: Math.round(weight),
      }));

      // Group by type
      const typeMap = new Map();
      summaryData.forEach((item: any) => {
        const existing = typeMap.get(item.wasteType) || 0;
        typeMap.set(item.wasteType, existing + item.areaWasteTotal);
      });
      const byType = Array.from(typeMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value),
      }));

      // Fetch trends (monthly for last 6 months)
      const trendsRes = await reportService.getTrends({ from, to, granularity: 'monthly' });
      const trendsData = trendsRes.data.data || [];
      const formattedTrends = trendsData.map((item: any) => ({
        month: `${item._id.y}-${String(item._id.m).padStart(2, '0')}`,
        weight: Math.round(item.monthlyTrend),
        count: item.count,
      }));

      // Fetch payment data
      const paymentsRes = await reportService.getPayments({ from, to });
      const paymentsData = paymentsRes.data.data;
      const income = paymentsData.totals.find((t: any) => t.type === 'payment')?.total || 0;
      const outstanding = paymentsData.outstanding || 0;

      setKpis({
        totalWaste: Math.round(totalWaste),
        totalPickups,
        totalIncome: Math.round(income),
        outstandingBills: Math.round(outstanding),
      });
      setWasteByArea(byArea);
      setWasteByType(byType);
      setTrendData(formattedTrends);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      reportService.exportPdf();
    } else {
      reportService.exportExcel();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-800">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with export buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Overview of waste management metrics (Last 30 days)</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Waste Collected</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.totalWaste} kg</p>
            </div>
            <div className="bg-[#2ECC71]/10 p-3 rounded-full">
              <Trash2 className="h-6 w-6 text-[#2ECC71]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pickups</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.totalPickups}</p>
            </div>
            <div className="bg-[#FF8C42]/10 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-[#FF8C42]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${kpis.totalIncome}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding Bills</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${kpis.outstandingBills}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste by Area */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Collection by Area</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteByArea}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" fill="#2ECC71" name="Weight (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste by Type */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Distribution by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.value}kg`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {wasteByType.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Collection Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#2ECC71" strokeWidth={2} name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
