import React from 'react';
import { User, MapPin, Mail, Phone, Star, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { Resident, Bin } from '../../api/collections.api';

interface ResidentInfoPanelProps {
  resident: Resident;
  bin: Bin;
}

/**
 * ResidentInfoPanel Component
 * Displays resident details, bin information, and collection eligibility
 */
const ResidentInfoPanel: React.FC<ResidentInfoPanelProps> = ({ resident, bin }) => {
  /**
   * Format date to readable string
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get status color based on bin status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emptied':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'not_collected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-green-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <User className="mr-2 text-green-600" size={24} />
          Resident Information
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            bin.status
          )}`}
        >
          {bin.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Resident Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div className="flex items-start">
          <User className="mr-2 text-gray-600 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-base font-semibold text-gray-800">{resident.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start">
          <Mail className="mr-2 text-gray-600 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base font-medium text-gray-800">{resident.email}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start">
          <MapPin className="mr-2 text-gray-600 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-base font-medium text-gray-800">{resident.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <Phone className="mr-2 text-gray-600 mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-base font-medium text-gray-800">{resident.phone}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Bin Information */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <Trash2 className="mr-2 text-green-600" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">Bin Details</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm text-gray-500">Bin ID</p>
            <p className="text-lg font-bold text-green-700">{bin.binID}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="mr-1" size={14} />
              Last Collection
            </p>
            <p className="text-base font-semibold text-gray-800">
              {formatDate(bin.lastCollection)}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Rewards & Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Star Points */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-sm border border-yellow-200">
          <div className="flex items-center mb-2">
            <Star className="mr-2 text-yellow-600" size={20} fill="currentColor" />
            <p className="text-sm font-medium text-gray-700">Star Points</p>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{resident.starPoints}</p>
          <p className="text-xs text-gray-600 mt-1">Earned from recyclable waste</p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 shadow-sm border border-orange-200">
          <div className="flex items-center mb-2">
            <DollarSign className="mr-2 text-orange-600" size={20} />
            <p className="text-sm font-medium text-gray-700">Outstanding Balance</p>
          </div>
          <p className="text-3xl font-bold text-orange-700">
            ${resident.outstandingBalance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">For non-recyclable waste</p>
        </div>
      </div>

      {/* Star Points Eligibility Notice */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Recyclable waste earns 10 points per kg. Non-recyclable
          waste incurs $5 per kg.
        </p>
      </div>
    </div>
  );
};

export default ResidentInfoPanel;
