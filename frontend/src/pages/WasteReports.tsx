import React, { useEffect, useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportService } from '../services/api';

export const WasteReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    area: '',
    wasteType: '',
    granularity: 'monthly' as 'daily' | 'weekly' | 'monthly',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = { granularity: filters.granularity };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.area) params.area = filters.area;
      if (filters.wasteType) params.wasteType = filters.wasteType;

      const res = await reportService.getTrends(params);
      const trendsData = res.data.data || [];
      
      // Format data for chart
      const formatted = trendsData.map((item: any) => ({
        period: filters.granularity === 'daily' 
          ? `${item._id.y}-${String(item._id.m).padStart(2, '0')}-${String(item._id.d).padStart(2, '0')}`
          : filters.granularity === 'weekly'
          ? `${item._id.y}-W${item._id.w}`
          : `${item._id.y}-${String(item._id.m).padStart(2, '0')}`,
        weight: Math.round(item.monthlyTrend),
        count: item.count,
      }));

      setData(formatted);
    } catch (err) {
      console.error('Error fetching waste reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Waste Collection Reports</h2>
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
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <input
              type="text"
              value={filters.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
              placeholder="e.g., North"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
            <select
              value={filters.wasteType}
              onChange={(e) => handleFilterChange('wasteType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="recyclable">Recyclable</option>
              <option value="organic">Organic</option>
              <option value="general">General</option>
              <option value="hazardous">Hazardous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Granularity</label>
            <select
              value={filters.granularity}
              onChange={(e) => handleFilterChange('granularity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Collection Trends</h3>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" fill="#2ECC71" name="Weight (kg)" />
              <Bar dataKey="count" fill="#FF8C42" name="Pickups" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickups
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.count}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
