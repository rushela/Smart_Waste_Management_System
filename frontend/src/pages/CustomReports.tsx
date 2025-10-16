import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Save, X } from 'lucide-react';
import { reportService } from '../services/api';

interface ReportConfig {
  _id?: string;
  name: string;
  filters: any;
  dateRange: {
    from?: string;
    to?: string;
  };
}

export const CustomReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<ReportConfig[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ReportConfig | null>(null);
  const [formData, setFormData] = useState<ReportConfig>({
    name: '',
    filters: { area: '', wasteType: '' },
    dateRange: { from: '', to: '' },
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await reportService.getConfigs();
      setConfigs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(true);
    setEditingConfig(null);
    setFormData({
      name: '',
      filters: { area: '', wasteType: '' },
      dateRange: { from: '', to: '' },
    });
  };

  const handleEdit = (config: ReportConfig) => {
    setIsEditing(true);
    setEditingConfig(config);
    setFormData({
      name: config.name,
      filters: config.filters || { area: '', wasteType: '' },
      dateRange: config.dateRange || { from: '', to: '' },
    });
  };

  const handleSave = async () => {
    try {
      if (editingConfig && editingConfig._id) {
        // Update existing
        await reportService.updateConfig(editingConfig._id, formData);
      } else {
        // Create new
        await reportService.createConfig(formData);
      }
      setIsEditing(false);
      setEditingConfig(null);
      fetchConfigs();
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report configuration?')) {
      return;
    }
    try {
      await reportService.deleteConfig(id);
      fetchConfigs();
    } catch (err) {
      console.error('Error deleting config:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Custom Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage custom report configurations</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingConfig ? 'Edit Report Configuration' : 'New Report Configuration'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly North Area Report"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Filter</label>
                <input
                  type="text"
                  value={formData.filters.area || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, filters: { ...formData.filters, area: e.target.value } })
                  }
                  placeholder="e.g., North"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type Filter</label>
                <select
                  value={formData.filters.wasteType || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, filters: { ...formData.filters, wasteType: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="organic">Organic</option>
                  <option value="general">General</option>
                  <option value="hazardous">Hazardous</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={formData.dateRange.from || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dateRange: { ...formData.dateRange, from: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={formData.dateRange.to || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dateRange: { ...formData.dateRange, to: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configs.map((config) => (
            <div
              key={config._id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-[#2ECC71] mr-2" />
                  <h3 className="font-semibold text-gray-800">{config.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(config)}
                    className="p-1 text-gray-600 hover:text-[#2ECC71] transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => config._id && handleDelete(config._id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {config.filters?.area && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Area:</span>
                    <span>{config.filters.area}</span>
                  </div>
                )}
                {config.filters?.wasteType && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Type:</span>
                    <span className="capitalize">{config.filters.wasteType}</span>
                  </div>
                )}
                {config.dateRange?.from && config.dateRange?.to && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Period:</span>
                    <span>
                      {config.dateRange.from} to {config.dateRange.to}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {configs.length === 0 && !isEditing && (
            <div className="col-span-full bg-white rounded-lg shadow p-12 border border-gray-200 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No custom reports yet</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
