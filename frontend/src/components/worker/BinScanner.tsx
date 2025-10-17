import React, { useState } from 'react';
import { QrCode, Keyboard } from 'lucide-react';

interface BinScannerProps {
  onScan: (binId: string) => void;
  isLoading?: boolean;
}

/**
 * BinScanner Component
 * Provides QR code scanning functionality with manual input fallback
 */
const BinScanner: React.FC<BinScannerProps> = ({ onScan, isLoading = false }) => {
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  /**
   * Handle manual bin ID submission
   */
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim().toUpperCase());
      setManualInput('');
    }
  };

  /**
   * Simulate QR code scan (in production, this would use a QR scanner library)
   * For now, it prompts for input
   */
  const handleQRScan = () => {
    const binId = prompt('Enter Bin ID (simulated QR scan):');
    if (binId && binId.trim()) {
      onScan(binId.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <QrCode className="mr-2 text-green-600" size={24} />
        Scan or Enter Bin ID
      </h3>

      <div className="space-y-4">
        {/* QR Scanner Button */}
        <button
          type="button"
          onClick={handleQRScan}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <QrCode className="mr-2" size={20} />
          {isLoading ? 'Scanning...' : 'Scan QR Code'}
        </button>

        {/* Toggle Manual Input */}
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full text-green-600 hover:text-green-700 font-medium py-2 flex items-center justify-center"
        >
          <Keyboard className="mr-2" size={18} />
          {showManualInput ? 'Hide Manual Entry' : 'Enter Bin ID Manually'}
        </button>

        {/* Manual Input Form */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                placeholder="e.g., BIN-R001"
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !manualInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter the Bin ID exactly as shown on the bin (e.g., BIN-R001)
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BinScanner;
