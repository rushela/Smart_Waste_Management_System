import React, { useState } from 'react';
import { QrCode, Keyboard } from 'lucide-react';

interface BinScannerProps {
  onScan: (binId: string) => void;
  isLoading?: boolean;
}

const BinScanner: React.FC<BinScannerProps> = ({ onScan, isLoading = false }) => {
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim().toUpperCase());
      setManualInput('');
    }
  };

  const handleQRScan = () => {
    const binId = prompt('Enter Bin ID (simulated QR scan):');
    if (binId && binId.trim()) {
      onScan(binId.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Scan or Enter Bin ID
      </h3>

      {!showManualInput ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleQRScan}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <QrCode size={24} />
            {isLoading ? 'Loading...' : 'Scan QR Code'}
          </button>

          <button
            type="button"
            onClick={() => setShowManualInput(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Keyboard size={18} />
            Manual Entry
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="binId" className="block text-sm font-medium text-gray-700 mb-2">
              Bin ID
            </label>
            <input
              type="text"
              id="binId"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter bin ID (e.g., BIN001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowManualInput(false);
                setManualInput('');
              }}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !manualInput.trim()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading || !manualInput.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BinScanner;
