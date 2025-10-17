import React from 'react';
import api from '../services/api';
import { ToastContainer, useToast } from '../components/Toast';
import { Recycle, TrendingUp, Scale, DollarSign } from 'lucide-react';

type RecyclableItem = { name: string; weight: number; rate: number };

export const PaybackPage: React.FC = () => {
  const [city, setCity] = React.useState('Colombo');
  const [name, setName] = React.useState('plastic');
  const [weight, setWeight] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [estimatedPayback, setEstimatedPayback] = React.useState(0);
  const [items, setItems] = React.useState<RecyclableItem[]>([]);
  const { toasts, addToast, removeToast } = useToast();

  const rates: Record<string, number> = {
    plastic: 0.2,
    metal: 0.5,
    'e-waste': 1.5,
    paper: 0.1,
    glass: 0.15
  };

  React.useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.weight * item.rate, 0);
    setEstimatedPayback(total);
  }, [items]);

  const addItem = () => {
    if (!name || weight <= 0) {
      addToast('Please enter valid type and weight', 'error');
      return;
    }
    const rate = rates[name] || 0;
    setItems([...items, { name, weight, rate }]);
    setName('plastic');
    setWeight(0);
    addToast(`Added ${weight}kg of ${name}`, 'success');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (items.length === 0) {
      addToast('Add at least one item', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/payments/payback', { 
        city, 
        items: items.map(i => ({ name: i.name, weight: i.weight }))
      }, { headers: { 'x-user-id': '000000000000000000000001' } });
      
      addToast(`Payback recorded: $${res.data.amount.toFixed(2)}`, 'success');
      setItems([]);
      setEstimatedPayback(0);
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Error recording payback', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2ECC71]/10 p-3 rounded-lg">
            <Recycle className="h-8 w-8 text-[#2ECC71]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recyclable Payback</h1>
            <p className="text-gray-600 mt-1">Record your recyclable waste and earn rewards</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Items Added</p>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Weight</p>
            <p className="text-2xl font-bold text-gray-900">{items.reduce((s, i) => s + i.weight, 0).toFixed(1)} kg</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Estimated Payback</p>
            <p className="text-3xl font-bold text-[#2ECC71]">${estimatedPayback.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Item Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Recyclable Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recyclable Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                >
                  <option value="plastic">♻️ Plastic (${rates.plastic}/kg)</option>
                  <option value="metal">🔩 Metal (${rates.metal}/kg)</option>
                  <option value="e-waste">📱 E-waste (${rates['e-waste']}/kg)</option>
                  <option value="paper">📄 Paper (${rates.paper}/kg)</option>
                  <option value="glass">🥛 Glass (${rates.glass}/kg)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent" 
                    value={weight || ''} 
                    onChange={e => setWeight(Number(e.target.value))} 
                    placeholder="0.0"
                  />
                </div>
                {weight > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Value: <span className="font-semibold text-[#2ECC71]">${(weight * rates[name]).toFixed(2)}</span>
                  </p>
                )}
              </div>
              <button 
                onClick={addItem} 
                className="w-full py-3 rounded-lg bg-[#2ECC71] text-white font-semibold hover:bg-[#27ae60] transition-all"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items to Submit</h3>
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No items added yet</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.weight} kg × ${item.rate}/kg</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#2ECC71]">${(item.weight * item.rate).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {items.length > 0 && (
              <button 
                onClick={submit}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Submit for ${estimatedPayback.toFixed(2)} Payback
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Payback Rates Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Current Payback Rates</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(rates).map(([type, rate]) => (
              <div key={type} className="text-center">
                <p className="text-sm text-blue-700 capitalize">{type}</p>
                <p className="text-lg font-bold text-blue-900">${rate}/kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
