import React from 'react';
import api from '../services/api';
import { ToastContainer, useToast } from '../components/Toast';
import { Settings, Plus, Edit, Trash2, DollarSign, X } from 'lucide-react';

type PricingModel = {
  _id: string;
  city: string;
  modelType: 'flat_fee' | 'weight_based';
  ratePerKg: number;
  flatFeeAmount: number;
  recyclablePaybackRates: {
    plastic: number;
    eWaste: number;
    metal: number;
    paper: number;
    glass?: number;
  };
};

export const AdminPricingPage: React.FC = () => {
  const [items, setItems] = React.useState<PricingModel[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<Partial<PricingModel>>({ 
    city: '', 
    modelType: 'flat_fee', 
    ratePerKg: 0, 
    flatFeeAmount: 0, 
    recyclablePaybackRates: { plastic: 0, eWaste: 0, metal: 0, paper: 0, glass: 0 } 
  });
  const { toasts, addToast, removeToast } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pricing');
      setItems(res.data || []);
    } catch (_e) {
      addToast('Failed to load pricing models', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => { fetchItems(); }, []);

  const openModal = (item?: PricingModel) => {
    if (item) {
      setEditingId(item._id);
      setForm(item);
    } else {
      setEditingId(null);
      setForm({ city: '', modelType: 'flat_fee', ratePerKg: 0, flatFeeAmount: 0, recyclablePaybackRates: { plastic: 0, eWaste: 0, metal: 0, paper: 0, glass: 0 } });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const submit = async () => {
    if (!form.city) {
      addToast('City name is required', 'error');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/pricing/${editingId}`, form);
        addToast('Pricing model updated successfully', 'success');
      } else {
        await api.post('/pricing', form);
        addToast('Pricing model created successfully', 'success');
      }
      closeModal();
      fetchItems();
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Failed to save pricing model', 'error');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this pricing model?')) return;
    try {
      await api.delete(`/pricing/${id}`);
      addToast('Pricing model deleted', 'success');
      fetchItems();
    } catch (_e) {
      addToast('Failed to delete pricing model', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pricing Management</h2>
              <p className="text-gray-600">Configure city pricing models and payback rates</p>
            </div>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Model
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-gray-600 text-sm">Total Models</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-gray-600 text-sm">Flat Fee Models</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.modelType === 'flat_fee').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-gray-600 text-sm">Weight-Based Models</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.modelType === 'weight_based').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Models Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Active Pricing Models</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pricing models configured yet.</p>
              <button 
                onClick={() => openModal()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create First Model
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payback Rates</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{it.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          it.modelType === 'flat_fee' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {it.modelType === 'flat_fee' ? 'Flat Fee' : 'Weight Based'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {it.modelType === 'weight_based' 
                            ? `$${it.ratePerKg}/kg` 
                            : `$${it.flatFeeAmount}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Plastic: ${it.recyclablePaybackRates.plastic}/kg</div>
                          <div>Metal: ${it.recyclablePaybackRates.metal}/kg</div>
                          <div>eWaste: ${it.recyclablePaybackRates.eWaste}/kg</div>
                          <div>Paper: ${it.recyclablePaybackRates.paper}/kg</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openModal(it)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => remove(it._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Pricing Model' : 'Create Pricing Model'}
              </h3>
              <button onClick={closeModal} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* City Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City Name</label>
                <input 
                  type="text"
                  placeholder="Enter city name" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.city} 
                  onChange={e => setForm({ ...form, city: e.target.value })} 
                />
              </div>

              {/* Model Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.modelType} 
                  onChange={e => setForm({ ...form, modelType: e.target.value as 'flat_fee' | 'weight_based' })}
                >
                  <option value="flat_fee">Flat Fee</option>
                  <option value="weight_based">Weight Based</option>
                </select>
              </div>

              {/* Charge Rate */}
              {form.modelType === 'weight_based' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate per Kg ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.ratePerKg} 
                    onChange={e => setForm({ ...form, ratePerKg: Number(e.target.value) })} 
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flat Fee Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.flatFeeAmount} 
                    onChange={e => setForm({ ...form, flatFeeAmount: Number(e.target.value) })} 
                  />
                </div>
              )}

              {/* Recyclable Payback Rates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Recyclable Payback Rates ($/kg)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Plastic</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={form.recyclablePaybackRates?.plastic || 0} 
                      onChange={e => setForm({ 
                        ...form, 
                        recyclablePaybackRates: { 
                          plastic: Number(e.target.value),
                          eWaste: form.recyclablePaybackRates?.eWaste || 0,
                          metal: form.recyclablePaybackRates?.metal || 0,
                          paper: form.recyclablePaybackRates?.paper || 0,
                          glass: form.recyclablePaybackRates?.glass || 0
                        } 
                      })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">eWaste</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={form.recyclablePaybackRates?.eWaste || 0} 
                      onChange={e => setForm({ 
                        ...form, 
                        recyclablePaybackRates: { 
                          plastic: form.recyclablePaybackRates?.plastic || 0,
                          eWaste: Number(e.target.value),
                          metal: form.recyclablePaybackRates?.metal || 0,
                          paper: form.recyclablePaybackRates?.paper || 0,
                          glass: form.recyclablePaybackRates?.glass || 0
                        } 
                      })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Metal</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={form.recyclablePaybackRates?.metal || 0} 
                      onChange={e => setForm({ 
                        ...form, 
                        recyclablePaybackRates: { 
                          plastic: form.recyclablePaybackRates?.plastic || 0,
                          eWaste: form.recyclablePaybackRates?.eWaste || 0,
                          metal: Number(e.target.value),
                          paper: form.recyclablePaybackRates?.paper || 0,
                          glass: form.recyclablePaybackRates?.glass || 0
                        } 
                      })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Paper</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={form.recyclablePaybackRates?.paper || 0} 
                      onChange={e => setForm({ 
                        ...form, 
                        recyclablePaybackRates: { 
                          plastic: form.recyclablePaybackRates?.plastic || 0,
                          eWaste: form.recyclablePaybackRates?.eWaste || 0,
                          metal: form.recyclablePaybackRates?.metal || 0,
                          paper: Number(e.target.value),
                          glass: form.recyclablePaybackRates?.glass || 0
                        } 
                      })} 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={submit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update Model' : 'Create Model'}
                </button>
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
