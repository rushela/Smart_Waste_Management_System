import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardListIcon, SaveIcon, InfoIcon } from 'lucide-react';
import Header from './components/Header';
import ActionButton from './components/ActionButton';
import InfoCard from './components/InfoCard';
import { wasteTypes, routes } from './data/mockData';
const ManualEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    binId: '',
    wasteType: '',
    fillLevel: 50,
    weight: '',
    contamination: false,
    contaminationDetails: '',
    notes: '',
    manualReason: 'offline'
  });
  const [binSuggestions, setBinSuggestions] = useState<string[]>([]);
  const [showBinSuggestions, setShowBinSuggestions] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (name === 'binId' && value) {
      // Show bin suggestions as user types
      const allBins = routes.flatMap(route => route.bins.map(bin => bin.id));
      const filtered = allBins.filter(id => id.toLowerCase().includes(value.toLowerCase()));
      setBinSuggestions(filtered);
      setShowBinSuggestions(filtered.length > 0);
    } else if (name === 'binId' && !value) {
      setShowBinSuggestions(false);
    }
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const selectBinSuggestion = (binId: string) => {
    setFormData(prev => ({
      ...prev,
      binId
    }));
    setShowBinSuggestions(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    console.log('Manual entry submitted:', formData);
    // Show success message
    alert('Manual entry recorded successfully!');
    // Navigate to summary
    navigate('/summary');
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Manual Entry" showBackButton />
      <main className="flex-1 p-4">
        <InfoCard title="Offline Collection Entry" icon={<ClipboardListIcon size={18} />}>
          <p className="text-gray-600 text-sm mb-4">
            Use this form when bin scanning is unavailable or when working
            offline.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Manual Entry
                </label>
                <select name="manualReason" value={formData.manualReason} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" required>
                  <option value="offline">Working Offline</option>
                  <option value="damaged_qr">Damaged QR Code</option>
                  <option value="no_qr">Missing QR Code</option>
                  <option value="scanner_error">Scanner Error</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bin ID
                </label>
                <input type="text" name="binId" value={formData.binId} onChange={handleInputChange} placeholder="Enter Bin ID (e.g., BIN001)" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" required />
                {showBinSuggestions && <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {binSuggestions.map(bin => <div key={bin} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectBinSuggestion(bin)}>
                        {bin}
                      </div>)}
                  </div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waste Type
                </label>
                <select name="wasteType" value={formData.wasteType} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" required>
                  <option value="">Select Waste Type</option>
                  {wasteTypes.map(type => <option key={type.id} value={type.id}>
                      {type.name}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fill Level: {formData.fillLevel}%
                </label>
                <input type="range" name="fillLevel" min="0" max="100" value={formData.fillLevel} onChange={handleInputChange} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Empty</span>
                  <span>Half</span>
                  <span>Full</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Enter estimated weight" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" required />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="contamination" name="contamination" checked={formData.contamination} onChange={handleInputChange} className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                <label htmlFor="contamination" className="ml-2 block text-sm text-gray-700">
                  Contamination Present
                </label>
              </div>
              {formData.contamination && <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contamination Details
                  </label>
                  <textarea name="contaminationDetails" value={formData.contaminationDetails} onChange={handleInputChange} placeholder="Describe the contamination" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" rows={2} />
                </div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Add any additional notes" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" rows={2} />
              </div>
            </div>
            <div className="mt-6">
              <ActionButton label="Submit Manual Entry" icon={<SaveIcon size={18} />} type="submit" onClick={() => {}} fullWidth />
            </div>
          </form>
        </InfoCard>
        <div className="mt-6">
          <div className="bg-blue-50 rounded-xl p-4 flex items-start">
            <InfoIcon size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Offline Mode</h3>
              <p className="text-blue-700 text-sm">
                Entries made while offline will be synchronized when you
                reconnect to the network.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={() => navigate('/worker/scan')} className="text-gray-600 hover:text-gray-800">
            Return to Scanner
          </button>
          <button type="button" onClick={() => navigate('/worker/dashboard')} className="text-gray-600 hover:text-gray-800">
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>;
};
export default ManualEntry;