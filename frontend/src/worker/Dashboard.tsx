import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanIcon, ClipboardListIcon, HistoryIcon, FileTextIcon, TruckIcon, CalendarIcon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import InfoCard from './components/InfoCard';
import ActionButton from './components/ActionButton';
import RouteList from './components/RouteList';
import { routes, collectionHistory } from './data/mockData';
const Dashboard: React.FC = () => {
  const {
    worker
  } = useAuth();
  const navigate = useNavigate();
  // Note: navigation passes binId via query param; no need to store locally
  const [stats, setStats] = useState({
    totalBins: 0,
    completedBins: 0,
    pendingBins: 0,
    totalWeight: 0
  });
  useEffect(() => {
    // Calculate dashboard stats
    let totalBins = 0;
    let completedBins = 0;
    routes.forEach((route: any) => {
      totalBins += route.bins.length;
      completedBins += route.bins.filter((bin: any) => bin.status === 'completed').length;
    });
    const pendingBins = totalBins - completedBins;
    // Calculate total weight from collection history
    const totalWeight = collectionHistory.reduce((sum: number, record: any) => sum + record.weight, 0);
    setStats({
      totalBins,
      completedBins,
      pendingBins,
      totalWeight: Math.round(totalWeight * 10) / 10 // Round to 1 decimal
    });
  }, []);
  const handleRouteSelect = (routeId: string) => {
    console.log('Route selected:', routeId);
  };
  const handleBinSelect = (binId: string) => {
    navigate(`/worker/scan?binId=${binId}`);
  };
  const navigateToScan = () => {
    navigate('/worker/scan');
  };
  const navigateToHistory = () => {
    navigate('/worker/history');
  };
  const navigateToManual = () => {
    navigate('/worker/manual');
  };
  const navigateToSummary = () => {
    navigate('/worker/summary');
  };
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Worker Dashboard" showLogout />
      <main className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Welcome, {worker?.name}
          </h2>
          <p className="text-gray-600">{today}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <InfoCard title="Pending Bins" icon={<ClipboardListIcon size={18} />} className="bg-yellow-50">
            <p className="text-2xl font-semibold">{stats.pendingBins}</p>
            <p className="text-sm text-gray-600">of {stats.totalBins} total</p>
          </InfoCard>
          <InfoCard title="Completed" icon={<HistoryIcon size={18} />} className="bg-green-50">
            <p className="text-2xl font-semibold">{stats.completedBins}</p>
            <p className="text-sm text-gray-600">
              {stats.totalBins > 0 ? Math.round(stats.completedBins / stats.totalBins * 100) : 0}
              % done
            </p>
          </InfoCard>
          <InfoCard title="Total Weight" icon={<TruckIcon size={18} />} className="bg-blue-50">
            <p className="text-2xl font-semibold">{stats.totalWeight} kg</p>
            <p className="text-sm text-gray-600">collected today</p>
          </InfoCard>
          <InfoCard title="Shift Status" icon={<CalendarIcon size={18} />} className="bg-purple-50">
            <p className="text-lg font-semibold">In Progress</p>
            <p className="text-sm text-gray-600">Started 8:00 AM</p>
          </InfoCard>
        </div>
        <div className="flex space-x-3 mb-6">
          <ActionButton label="Scan Bin" icon={<ScanIcon size={18} />} onClick={navigateToScan} fullWidth />
          <ActionButton label="Manual Entry" icon={<ClipboardListIcon size={18} />} onClick={navigateToManual} variant="outline" fullWidth />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Your Routes</h3>
        <RouteList onRouteSelect={handleRouteSelect} onBinSelect={handleBinSelect} />
        <div className="mt-6 space-y-3">
          <ActionButton label="Collection History" icon={<HistoryIcon size={18} />} onClick={navigateToHistory} variant="outline" fullWidth />
          <ActionButton label="Shift Summary" icon={<FileTextIcon size={18} />} onClick={navigateToSummary} variant="outline" fullWidth />
        </div>
      </main>
    </div>;
};
export default Dashboard;