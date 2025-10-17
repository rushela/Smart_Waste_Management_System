import React, { useState } from 'react';
import { issueAPI } from '../../services/issueApi';
import { AlertCircle, MapPin, FileText, Send } from 'lucide-react';

interface IssueFormProps {
  onSuccess?: () => void;
}

const categories = [
  { value: 'collection', label: 'Missed Collection', icon: '🗑️' },
  { value: 'bin', label: 'Bin Issue (Full/Broken)', icon: '♻️' },
  { value: 'payment', label: 'Payment Problem', icon: '💳' },
  { value: 'sensor', label: 'Sensor Malfunction', icon: '📡' },
  { value: 'other', label: 'Other', icon: '📝' },
];

export function IssueForm({ onSuccess }: IssueFormProps) {
  const [formData, setFormData] = useState({
    category: 'collection',
    description: '',
    city: '',
    area: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.description.trim().length < 10) {
      setError('Please provide a detailed description (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await issueAPI.create({
        category: formData.category,
        description: formData.description,
        location: {
          city: formData.city || undefined,
          area: formData.area || undefined,
          address: formData.address || undefined
        }
      });

      setSuccess(true);
      setFormData({
        category: 'collection',
        description: '',
        city: '',
        area: '',
        address: ''
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Report an Issue</h2>
        <p className="text-gray-600">Help us serve you better by reporting waste management issues</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Issue Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(cat => (
              <label
                key={cat.value}
                className={`relative flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.category === cat.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                {formData.category === cat.value && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border border-gray-300 py-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
              placeholder="Please describe the issue in detail..."
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">{formData.description.length} / 500 characters</p>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 py-3 px-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              placeholder="e.g. Colombo"
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1.5">
              Area / Neighborhood
            </label>
            <input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 py-3 px-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              placeholder="e.g. Kollupitiya"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
            Specific Address (Optional)
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border border-gray-300 py-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              placeholder="Street address or landmark"
            />
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✅ Issue reported successfully! We'll look into it soon.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {loading ? 'Submitting...' : 'Submit Issue'}
        </button>
      </form>
    </div>
  );
}
