import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, DownloadIcon, PrinterIcon, CheckCircleIcon, BarChart2Icon, TruckIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import ActionButton from './components/ActionButton';
import InfoCard from './components/InfoCard';
import { collectionHistory, routes, wasteTypes } from './data/mockData';
const Summary: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Calculate summary statistics
  const stats = {
    totalCollections: collectionHistory.length,
    totalWeight: collectionHistory.reduce((sum, record) => sum + record.weight, 0).toFixed(1),
    routesCompleted: routes.filter(route => route.bins.every(bin => bin.status === 'completed')).length,
    totalRoutes: routes.length,
    startTime: '08:00 AM',
    endTime: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  // Calculate waste type breakdown
  const wasteBreakdown = collectionHistory.reduce((acc: Record<string, number>, record) => {
    if (!acc[record.wasteType]) {
      acc[record.wasteType] = 0;
    }
    acc[record.wasteType] += record.weight;
    return acc;
  }, {});
  const getWasteTypeName = (typeId: string) => {
    const type = wasteTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };
  const getWasteTypeColor = (typeId: string) => {
    const type = wasteTypes.find(t => t.id === typeId);
    return type ? type.color : 'bg-gray-500';
  };
  const handleExport = () => {
    // TODO: Replace with real API call
    // await workerApi.summary.getReport();
    alert('Summary exported successfully!');
  };
  const handlePrint = () => {
    window.print();
  };
  const handleSubmitShift = () => {
    setIsSubmitting(true);
    // TODO: Replace with real API call
    // await workerApi.summary.endSession();
    setTimeout(() => {
      alert('Shift submitted successfully!');
      logout(); // Clear authentication
      navigate('/worker/login');
    }, 1500);
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Shift Summary" showBackButton />
      <main className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-800">Shift Report</h2>
          <p className="text-gray-600">{stats.date}</p>
        </div>
        <InfoCard title="Collection Summary" icon={<FileTextIcon size={18} />}>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center">
              <TruckIcon size={18} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Total Collections</p>
                <p className="font-medium text-lg">{stats.totalCollections}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BarChart2Icon size={18} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Total Weight</p>
                <p className="font-medium text-lg">{stats.totalWeight} kg</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={18} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Routes Completed</p>
                <p className="font-medium text-lg">
                  {stats.routesCompleted} of {stats.totalRoutes}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ClockIcon size={18} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Shift Duration</p>
                <p className="font-medium text-lg">
                  {stats.startTime} - {stats.endTime}
                </p>
              </div>
            </div>
          </div>
        </InfoCard>
        <div className="mt-4">
          <InfoCard title="Waste Type Breakdown" icon={<BarChart2Icon size={18} />}>
            <div className="mt-3 space-y-3">
              {Object.entries(wasteBreakdown).map(([type, weight]) => <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getWasteTypeColor(type)}`}></div>
                      <p className="font-medium">{getWasteTypeName(type)}</p>
                    </div>
                    <p className="font-medium">{weight.toFixed(1)} kg</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${getWasteTypeColor(type).replace('bg-', 'bg-opacity-80 bg-')}`} style={{
                  width: `${weight / parseFloat(stats.totalWeight) * 100}%`
                }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500">
                    {Math.round(weight / parseFloat(stats.totalWeight) * 100)}
                    % of total
                  </p>
                </div>)}
            </div>
          </InfoCard>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ActionButton label="Export Report" icon={<DownloadIcon size={18} />} onClick={handleExport} variant="outline" />
          <ActionButton label="Print Summary" icon={<PrinterIcon size={18} />} onClick={handlePrint} variant="outline" />
        </div>
        <div className="mt-6">
          <ActionButton label={isSubmitting ? 'Submitting...' : 'Submit & End Shift'} icon={<CheckCircleIcon size={18} />} onClick={handleSubmitShift} fullWidth disabled={isSubmitting} />
        </div>
        <div className="mt-4 text-center">
          <button type="button" onClick={() => navigate('/worker/dashboard')} className="text-gray-600 hover:text-gray-800">
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>;
};
export default Summary;