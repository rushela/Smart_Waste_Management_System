import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryIcon, SearchIcon, EditIcon, Trash2Icon, InfoIcon, XIcon, AlertTriangleIcon } from 'lucide-react';
import Header from './components/Header';
import ActionButton from './components/ActionButton';
// import InfoCard from './components/InfoCard';
import { collectionHistory, getBinById, getResidentByBinId } from './data/mockData';
const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(collectionHistory);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  useEffect(() => {
    const filtered = collectionHistory.filter(record => record.binId.toLowerCase().includes(searchTerm.toLowerCase()) || record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredHistory(filtered);
  }, [searchTerm]);
  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
  };
  const handleEditRecord = (record: any) => {
    setEditData({
      ...record
    });
    setShowEditModal(true);
  };
  const handleDeleteRecord = (record: any) => {
    setSelectedRecord(record);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    // In a real app, this would call an API to delete the record
    console.log('Deleting record:', selectedRecord.id);
    // Update the filtered history (simulating a delete)
    const updated = filteredHistory.filter(r => r.id !== selectedRecord.id);
    setFilteredHistory(updated);
    // Close the modal
    setShowDeleteConfirm(false);
    setSelectedRecord(null);
  };
  const handleSaveEdit = () => {
    // In a real app, this would call an API to update the record
    console.log('Saving edited record:', editData);
    // Update the filtered history (simulating an update)
    const updated = filteredHistory.map(r => r.id === editData.id ? editData : r);
    setFilteredHistory(updated);
    // Close the modal
    setShowEditModal(false);
    setEditData(null);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditData((prev: any) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'recycling':
        return 'bg-blue-500';
      case 'compost':
        return 'bg-green-500';
      case 'paper':
        return 'bg-yellow-500';
      case 'glass':
        return 'bg-purple-500';
      case 'electronic':
        return 'bg-red-500';
      case 'general':
      default:
        return 'bg-gray-500';
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Collection History" showBackButton />
      <main className="flex-1 p-4">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by bin ID or notes" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>
        {filteredHistory.length === 0 ? <div className="text-center py-8">
            <HistoryIcon size={48} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No collection records found</p>
          </div> : <div className="space-y-4">
            {filteredHistory.map(record => {
          const bin = getBinById(record.binId);
          const resident = getResidentByBinId(record.binId);
          return <div key={record.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getWasteTypeColor(record.wasteType)}`}></div>
                          <h3 className="font-medium text-gray-800">
                            {record.binId}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(record.timestamp)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewRecord(record)} className="text-gray-500 hover:text-gray-700" aria-label="View details">
                          <InfoIcon size={18} />
                        </button>
                        <button onClick={() => handleEditRecord(record)} className="text-blue-500 hover:text-blue-700" aria-label="Edit">
                          <EditIcon size={18} />
                        </button>
                        <button onClick={() => handleDeleteRecord(record)} className="text-red-500 hover:text-red-700" aria-label="Delete">
                          <Trash2Icon size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Weight:</span>{' '}
                        {record.weight} kg
                      </div>
                      <div>
                        <span className="text-gray-500">Fill:</span>{' '}
                        {record.fillLevel}%
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Address:</span>{' '}
                        {bin?.address || 'N/A'}
                      </div>
                      {resident && <div className="col-span-2">
                          <span className="text-gray-500">Resident:</span>{' '}
                          {resident.name}
                        </div>}
                      {record.contamination && <div className="col-span-2 text-red-600 flex items-center">
                          <AlertTriangleIcon size={14} className="mr-1" />
                          Contamination Present
                        </div>}
                    </div>
                    {record.notes && <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      </div>}
                  </div>
                </div>;
        })}
          </div>}
        <div className="mt-6">
          <ActionButton label="Back to Dashboard" onClick={() => navigate('/worker/dashboard')} variant="outline" fullWidth />
        </div>
      </main>
      {/* View Record Modal */}
      {selectedRecord && !showDeleteConfirm && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Collection Details
              </h2>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Bin ID</p>
                  <p className="font-medium">{selectedRecord.binId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(selectedRecord.timestamp)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waste Type</p>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getWasteTypeColor(selectedRecord.wasteType)}`}></div>
                    <p className="font-medium capitalize">
                      {selectedRecord.wasteType}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{selectedRecord.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fill Level</p>
                  <p className="font-medium">{selectedRecord.fillLevel}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contamination</p>
                  <p className="font-medium">
                    {selectedRecord.contamination ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              {selectedRecord.contamination && selectedRecord.contaminationDetails && <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Contamination Details
                    </p>
                    <p className="bg-red-50 p-2 rounded-lg text-red-700 mt-1">
                      {selectedRecord.contaminationDetails}
                    </p>
                  </div>}
              {selectedRecord.notes && <div className="mb-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="bg-gray-50 p-2 rounded-lg mt-1">
                    {selectedRecord.notes}
                  </p>
                </div>}
              <div className="flex space-x-2 mt-4">
                <button onClick={() => {
              setSelectedRecord(null);
              handleEditRecord(selectedRecord);
            }} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <EditIcon size={16} className="mr-2" />
                  Edit
                </button>
                <button onClick={() => {
              setShowDeleteConfirm(true);
            }} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <Trash2Icon size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Deletion
              </h2>
            </div>
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete this collection record?
              </p>
              <p className="mb-4 bg-yellow-50 p-2 rounded-lg text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button onClick={() => {
              setShowDeleteConfirm(false);
              setSelectedRecord(null);
            }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Edit Modal */}
      {showEditModal && editData && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Collection
              </h2>
              <button onClick={() => {
            setShowEditModal(false);
            setEditData(null);
          }} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={e => {
            e.preventDefault();
            handleSaveEdit();
          }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bin ID
                    </label>
                    <input type="text" value={editData.binId} disabled className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input type="number" name="weight" value={editData.weight} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fill Level: {editData.fillLevel}%
                    </label>
                    <input type="range" name="fillLevel" min="0" max="100" value={editData.fillLevel} onChange={handleInputChange} className="w-full" />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="edit-contamination" name="contamination" checked={editData.contamination} onChange={handleInputChange} className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                    <label htmlFor="edit-contamination" className="ml-2 block text-sm text-gray-700">
                      Contamination Present
                    </label>
                  </div>
                  {editData.contamination && <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contamination Details
                      </label>
                      <textarea name="contaminationDetails" value={editData.contaminationDetails || ''} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" rows={2} />
                    </div>}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea name="notes" value={editData.notes} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-orange-500 focus:border-orange-500" rows={2} />
                  </div>
                </div>
                <div className="mt-6">
                  <ActionButton label="Save Changes" type="submit" onClick={() => {}} fullWidth />
                </div>
              </form>
            </div>
          </div>
        </div>}
    </div>;
};
export default History;