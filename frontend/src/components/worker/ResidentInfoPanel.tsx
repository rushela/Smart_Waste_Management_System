import React from 'react';
import { User, MapPin, Mail, Phone, Star, DollarSign, Package } from 'lucide-react';

interface Resident {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  starPoints: number;
  outstandingBalance: number;
}

interface Bin {
  _id: string;
  binID: string;
  status: string;
  lastCollection?: string | null;
}

interface ResidentInfoPanelProps {
  resident: Resident;
  bin: Bin;
}

const ResidentInfoPanel: React.FC<ResidentInfoPanelProps> = ({ resident, bin }) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User size={20} className="text-blue-600" />
        Resident Information
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resident Details */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 text-lg mb-3">{resident.name}</h4>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{resident.address}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">{resident.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">{resident.phone}</span>
            </div>
          </div>
        </div>

        {/* Rewards & Bin Info */}
        <div className="space-y-3">
          {/* Star Points */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Star Points</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {resident.starPoints}
              </span>
            </div>
          </div>

          {/* Outstanding Balance */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Outstanding Balance</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${resident.outstandingBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Bin Info */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Bin {bin.binID}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Status:</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(bin.status)}`}>
                {bin.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">Last Collection:</span>
              <span className="text-xs text-gray-700 font-medium">
                {formatDate(bin.lastCollection)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Rewards:</strong> Recyclable waste earns 10 star points per kg. 
          Non-recyclable waste earns $5 payment per kg.
        </p>
      </div>
    </div>
  );
};

export default ResidentInfoPanel;
