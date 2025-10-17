import React from 'react';
import { XIcon, PhoneIcon, HomeIcon, ClipboardIcon } from 'lucide-react';
import { residents } from '../data/mockData';
interface ResidentProfileModalProps {
  residentId: string | null;
  binId: string | null;
  onClose: () => void;
}
const ResidentProfileModal: React.FC<ResidentProfileModalProps> = ({
  residentId,
  binId,
  onClose
}) => {
  // Find resident either by residentId or binId
  const resident = residentId ? residents.find(r => r.id === residentId) : binId ? residents.find(r => r.binId === binId) : null;
  if (!resident) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Resident Profile
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xl font-bold mx-auto">
              {resident.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-medium text-center mt-2">
              {resident.name}
            </h3>
            <p className="text-gray-500 text-center">ID: {resident.id}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <HomeIcon size={20} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800">{resident.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <PhoneIcon size={20} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{resident.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <ClipboardIcon size={20} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Bin ID</p>
                <p className="text-gray-800">{resident.binId}</p>
              </div>
            </div>
            {resident.notes && <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-800">{resident.notes}</p>
              </div>}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button onClick={onClose} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>;
};
export default ResidentProfileModal;