import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScanIcon, UserIcon, ClipboardListIcon, AlertTriangleIcon, CheckCircleIcon, HistoryIcon, ArrowRightIcon } from 'lucide-react';
import Header from './components/Header';
import ActionButton from './components/ActionButton';
import InfoCard from './components/InfoCard';
import ResidentProfileModal from './components/ResidentProfileModal';
import { getBinById, getResidentByBinId, wasteTypes } from './data/mockData';
const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const binIdFromUrl = queryParams.get('binId');
  const [binId, setBinId] = useState(binIdFromUrl || '');
  const [binInfo, setBinInfo] = useState<any>(null);
  const [resident, setResident] = useState<any>(null);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: '',
    fillLevel: 50,
    weight: '',
    contamination: false,
    contaminationDetails: '',
    notes: ''
  });
  // Effect to load bin info when binId is available from URL
  useEffect(() => {
    if (binIdFromUrl) {
      handleBinLookup(binIdFromUrl);
    }
  }, [binIdFromUrl]);
  const handleBinLookup = (id: string) => {
    // Simulate scanning or lookup
    setIsScanning(true);
    setTimeout(() => {
      const bin = getBinById(id);
      setBinInfo(bin);
      if (bin) {
        const residentInfo = getResidentByBinId(id);
        setResident(residentInfo);
        setFormData(prev => ({
          ...prev,
          wasteType: bin.type
        }));
        setScanSuccess(true);
      } else {
        setScanSuccess(false);
      }
      setIsScanning(false);
    }, 1000);
  };
  const handleScan = () => {
    // In a real app, this would activate the camera/scanner
    // For demo, we'll simulate finding a random bin
    const demoIds = ['BIN001', 'BIN005', 'BIN009'];
    const randomId = demoIds[Math.floor(Math.random() * demoIds.length)];
    setBinId(randomId);
    handleBinLookup(randomId);
  };
  const handleShowResident = () => {
    setShowResidentModal(true);
  };
  const handleManualEntry = () => {
    navigate('/worker/manual');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    console.log('Form submitted:', {
      binId,
      ...formData
    });
    // Show success message
    alert('Collection recorded successfully!');
    // Navigate to dashboard
    navigate('/dashboard');
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Bin Scanning" showBackButton />
      <main className="flex-1 p-4">
        {!scanSuccess && <div className="mb-6">
            <InfoCard title="Scan or Enter Bin ID" icon={<ScanIcon size={18} />}>
              <div className="flex mt-2">
                <input type="text" value={binId} onChange={e => setBinId(e.target.value)} placeholder="Enter Bin ID" className="flex-1 border border-gray-300 rounded-l-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" disabled={isScanning} />
                <button onClick={() => handleBinLookup(binId)} className="bg-orange-500 text-white px-4 py-2 rounded-r-xl hover:bg-orange-600 transition-colors" disabled={!binId || isScanning}>
                  {isScanning ? 'Searching...' : 'Find'}
                </button>
              </div>
              <div className="mt-4">
                <ActionButton label={isScanning ? 'Scanning...' : 'Scan Bin QR Code'} icon={<ScanIcon size={18} />} onClick={handleScan} fullWidth disabled={isScanning} />
              </div>
            </InfoCard>
          </div>}
        {isScanning && <div className="flex justify-center my-8">
            <div className="animate-pulse text-center">
              <ScanIcon size={48} className="text-orange-500 mx-auto mb-2" />
              <p className="text-gray-600">Scanning...</p>
            </div>
          </div>}
        {scanSuccess && binInfo && <form onSubmit={handleSubmit}>
            <InfoCard title="Bin Information" icon={<ClipboardListIcon size={18} />}>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Bin ID</p>
                  <p className="font-medium">{binInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{binInfo.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{binInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{binInfo.routeName}</p>
                </div>
              </div>
              {resident && <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserIcon size={18} className="text-gray-500 mr-2" />
                      <p className="font-medium">{resident.name}</p>
                    </div>
                    <button type="button" onClick={handleShowResident} className="text-blue-500 text-sm font-medium hover:text-blue-700">
                      View Profile
                    </button>
                  </div>
                </div>}
            </InfoCard>
            <div className="mt-4">
              <InfoCard title="Collection Details">
                <div className="space-y-4 mt-2">
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
              </InfoCard>
            </div>
            <div className="mt-6">
              <ActionButton label="Record Collection" icon={<CheckCircleIcon size={18} />} type="submit" onClick={() => {}} fullWidth />
            </div>
          </form>}
        {!isScanning && !scanSuccess && <div className="mt-8">
            <div className="text-center mb-6">
              <AlertTriangleIcon size={40} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No bin scanned yet</p>
            </div>
            <ActionButton label="Switch to Manual Entry" icon={<ClipboardListIcon size={18} />} onClick={handleManualEntry} variant="outline" fullWidth />
          </div>}
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={() => navigate('/worker/history')} className="flex items-center text-gray-600 hover:text-gray-800">
            <HistoryIcon size={16} className="mr-1" />
            <span>History</span>
          </button>
          <button type="button" onClick={() => navigate('/worker/dashboard')} className="flex items-center text-gray-600 hover:text-gray-800">
            <span>Dashboard</span>
            <ArrowRightIcon size={16} className="ml-1" />
          </button>
        </div>
      </main>
      {showResidentModal && <ResidentProfileModal residentId={null} binId={binId} onClose={() => setShowResidentModal(false)} />}
    </div>;
};
export default ScanPage;