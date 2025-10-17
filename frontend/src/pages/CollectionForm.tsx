import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  Scale,
  FileText,
  Recycle,
  Trash2,
} from 'lucide-react';
import BinScanner from '../components/worker/BinScanner';
import ResidentInfoPanel from '../components/worker/ResidentInfoPanel';
import {
  getBinDetails,
  createCollection,
  calculateStarPoints,
  calculatePayment,
  type Resident,
  type Bin,
  type CreateCollectionPayload,
} from '../api/collections.api';

/**
 * CollectionForm Component
 * Main form for workers to record waste collections
 */
const CollectionForm: React.FC = () => {
  // State Management
  const [binID, setBinID] = useState('');
  const [resident, setResident] = useState<Resident | null>(null);
  const [bin, setBin] = useState<Bin | null>(null);
  const [wasteType, setWasteType] = useState<'recyclable' | 'non_recyclable'>('recyclable');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [starPoints, setStarPoints] = useState(0);
  const [payment, setPayment] = useState(0);

  // UI State
  const [isLoadingBin, setIsLoadingBin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Fetch bin and resident details when binID is scanned
   */
  const handleBinScan = async (scannedBinId: string) => {
    setIsLoadingBin(true);
    setError(null);
    setSuccess(null);
    setBinID(scannedBinId);
    setResident(null);
    setBin(null);

    try {
      const response = await getBinDetails(scannedBinId);
      setBin(response.data.bin);
      setResident(response.data.resident);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Bin not found. Please check the Bin ID and try again.';
      setError(errorMessage);
      setResident(null);
      setBin(null);
    } finally {
      setIsLoadingBin(false);
    }
  };

  /**
   * Calculate star points and payment when weight or waste type changes
   */
  useEffect(() => {
    const weightNum = parseFloat(weight) || 0;

    if (wasteType === 'recyclable') {
      setStarPoints(calculateStarPoints(weightNum));
      setPayment(0);
    } else {
      setStarPoints(0);
      setPayment(calculatePayment(weightNum));
    }
  }, [weight, wasteType]);

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!binID || !bin) {
      errors.binID = 'Please scan or enter a valid Bin ID';
    }

    if (!weight || parseFloat(weight) < 0) {
      errors.weight = 'Please enter a valid weight (must be 0 or greater)';
    }

    if (!wasteType) {
      errors.wasteType = 'Please select a waste type';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle collection submission
   */
  const handleSubmit = async (status: 'collected' | 'partial' | 'not_collected') => {
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateCollectionPayload = {
        binID: binID,
        wasteType,
        weight: parseFloat(weight) || 0,
        status,
        notes: notes.trim() || undefined,
        workerId: 'WORKER-001', // In production, get from auth context
        dateCollected: new Date().toISOString(),
      };

      const response = await createCollection(payload);

      // Update resident data with new values
      if (response.data.resident) {
        setResident(response.data.resident);
      }

      // Show success message
      const statusMessages = {
        collected: 'Collection recorded successfully!',
        partial: 'Partial collection recorded. Bin marked for follow-up.',
        not_collected: 'Bin marked as not collected. Reason noted.',
      };

      setSuccess(statusMessages[status]);

      // Reset form
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to record collection. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setBinID('');
    setResident(null);
    setBin(null);
    setWasteType('recyclable');
    setWeight('');
    setNotes('');
    setStarPoints(0);
    setPayment(0);
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Recycle className="mr-3 text-green-600" size={32} />
            Waste Collection Form
          </h1>
          <p className="text-gray-600">Scan bin, record collection, and earn rewards</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center animate-pulse">
            <CheckCircle className="mr-3" size={24} />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
            <XCircle className="mr-3" size={24} />
            <div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Bin Scanner */}
        <BinScanner onScan={handleBinScan} isLoading={isLoadingBin} />

        {/* Loading State */}
        {isLoadingBin && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <Loader className="animate-spin mx-auto text-green-600 mb-4" size={48} />
            <p className="text-gray-600">Loading bin details...</p>
          </div>
        )}

        {/* Resident Info Panel */}
        {resident && bin && !isLoadingBin && (
          <>
            <ResidentInfoPanel resident={resident} bin={bin} />

            {/* Collection Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Trash2 className="mr-2 text-green-600" size={24} />
                Record Collection
              </h3>

              <form className="space-y-6">
                {/* Waste Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Waste Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recyclable Option */}
                    <label
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        wasteType === 'recyclable'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wasteType"
                        value="recyclable"
                        checked={wasteType === 'recyclable'}
                        onChange={(e) =>
                          setWasteType(e.target.value as 'recyclable' | 'non_recyclable')
                        }
                        className="mr-3"
                      />
                      <Recycle
                        className={wasteType === 'recyclable' ? 'text-green-600' : 'text-gray-500'}
                        size={24}
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">Recyclable</p>
                        <p className="text-sm text-gray-600">Earns star points (10 pts/kg)</p>
                      </div>
                    </label>

                    {/* Non-Recyclable Option */}
                    <label
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        wasteType === 'non_recyclable'
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wasteType"
                        value="non_recyclable"
                        checked={wasteType === 'non_recyclable'}
                        onChange={(e) =>
                          setWasteType(e.target.value as 'recyclable' | 'non_recyclable')
                        }
                        className="mr-3"
                      />
                      <Trash2
                        className={
                          wasteType === 'non_recyclable' ? 'text-orange-600' : 'text-gray-500'
                        }
                        size={24}
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">Non-Recyclable</p>
                        <p className="text-sm text-gray-600">Charges fee ($5/kg)</p>
                      </div>
                    </label>
                  </div>
                  {validationErrors.wasteType && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.wasteType}</p>
                  )}
                </div>

                {/* Weight Input */}
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Scale className="mr-2" size={18} />
                    Weight (kg) <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight in kilograms"
                    min="0"
                    step="0.1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.weight && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.weight}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <FileText className="mr-2" size={18} />
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about the collection (e.g., overflow, contamination, access issues)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Calculated Rewards */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Calculated Rewards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Star Points */}
                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <span className="text-sm font-medium text-gray-700">Star Points:</span>
                      <span className="text-2xl font-bold text-yellow-700">+{starPoints}</span>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <span className="text-sm font-medium text-gray-700">Payment:</span>
                      <span className="text-2xl font-bold text-orange-700">
                        ${payment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {/* Confirm Collection */}
                  <button
                    type="button"
                    onClick={() => handleSubmit('collected')}
                    disabled={isSubmitting}
                    className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <Loader className="animate-spin mr-2" size={20} />
                    ) : (
                      <CheckCircle className="mr-2" size={20} />
                    )}
                    Confirm Collection
                  </button>

                  {/* Partial Collection */}
                  <button
                    type="button"
                    onClick={() => handleSubmit('partial')}
                    disabled={isSubmitting}
                    className="flex-1 min-w-[200px] bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <AlertTriangle className="mr-2" size={20} />
                    Partial Collection
                  </button>

                  {/* Not Collected */}
                  <button
                    type="button"
                    onClick={() => handleSubmit('not_collected')}
                    disabled={isSubmitting}
                    className="flex-1 min-w-[200px] bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <XCircle className="mr-2" size={20} />
                    Not Collected
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Empty State */}
        {!resident && !bin && !isLoadingBin && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Recycle className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Scan</h3>
            <p className="text-gray-500">
              Scan a bin QR code or enter a Bin ID to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionForm;
