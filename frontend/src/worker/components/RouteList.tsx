import React, { useState } from 'react';
import { MapPinIcon, PackageIcon } from 'lucide-react';
import { routes } from '../data/mockData';
interface RouteListProps {
  onRouteSelect: (routeId: string) => void;
  onBinSelect: (binId: string) => void;
}
const RouteList: React.FC<RouteListProps> = ({
  onRouteSelect,
  onBinSelect
}) => {
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const handleRouteClick = (routeId: string) => {
    setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
    onRouteSelect(routeId);
  };
  const getBinStatusClass = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };
  const getWasteTypeIcon = (type: string) => {
    switch (type) {
      case 'recycling':
        return 'bg-blue-500';
      case 'compost':
        return 'bg-green-500';
      case 'general':
      default:
        return 'bg-gray-500';
    }
  };
  return <div className="space-y-4">
      {routes.map(route => <div key={route.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => handleRouteClick(route.id)}>
            <div className="flex items-center">
              <MapPinIcon size={20} className="text-orange-500 mr-2" />
              <div>
                <h3 className="font-medium text-gray-800">{route.name}</h3>
                <p className="text-sm text-gray-600">{route.address}</p>
              </div>
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded text-sm">
              {route.bins.length} bins
            </div>
          </div>
          {expandedRouteId === route.id && <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Bins on this route:</p>
              <ul className="space-y-2">
                {route.bins.map(bin => <li key={bin.id} className="flex items-center justify-between p-2 rounded-lg border bg-white cursor-pointer hover:bg-gray-50" onClick={() => onBinSelect(bin.id)}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getWasteTypeIcon(bin.type)}`}></div>
                      <span className="font-medium text-gray-700">
                        {bin.id}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {bin.address}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getBinStatusClass(bin.status)}`}>
                      {bin.status}
                    </span>
                  </li>)}
              </ul>
            </div>}
        </div>)}
    </div>;
};
export default RouteList;