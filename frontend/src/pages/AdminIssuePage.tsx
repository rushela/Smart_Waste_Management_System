import { useState, useEffect } from 'react';
import { issueAPI } from '../services/issueApi';
import { Search, Trash2, UserCheck, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Issue {
  _id: string;
  userId: { _id: string; name: string; email: string };
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  location?: { city?: string; area?: string; address?: string };
  assignedTo?: { _id: string; name: string };
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminIssuePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    city: '',
    search: ''
  });

  const [updateData, setUpdateData] = useState({
    status: '',
    assignedTo: '',
    resolutionNotes: ''
  });

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await issueAPI.getAll({
        status: filters.status || undefined,
        category: filters.category || undefined,
        city: filters.city || undefined,
        q: filters.search || undefined
      });
      setIssues(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setUpdateData({
      status: issue.status,
      assignedTo: issue.assignedTo?._id || '',
      resolutionNotes: issue.resolutionNotes || ''
    });
  };

  const handleUpdateIssue = async () => {
    if (!selectedIssue) return;

    try {
      await issueAPI.update(selectedIssue._id, {
        status: updateData.status || undefined,
        assignedTo: updateData.assignedTo || undefined,
        resolutionNotes: updateData.resolutionNotes || undefined
      });
      fetchIssues();
      setSelectedIssue(null);
      alert('Issue updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update issue');
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!isAdmin) {
      alert('Only admins can delete issues');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await issueAPI.delete(id);
      fetchIssues();
      setSelectedIssue(null);
      alert('Issue deleted successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete issue');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <AlertTriangle size={16} className="text-red-600" />;
      case 'In Progress': return <Clock size={16} className="text-orange-600" />;
      case 'Resolved': return <CheckCircle size={16} className="text-green-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Issues</h1>
          <p className="text-gray-600">View and manage all reported issues</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              <option value="collection">Collection</option>
              <option value="bin">Bin</option>
              <option value="payment">Payment</option>
              <option value="sensor">Sensor</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              placeholder="City..."
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-red-600">
                  {issues.filter(i => i.status === 'Pending').length}
                </p>
              </div>
              <AlertTriangle size={40} className="text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {issues.filter(i => i.status === 'In Progress').length}
                </p>
              </div>
              <Clock size={40} className="text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'Resolved').length}
                </p>
              </div>
              <CheckCircle size={40} className="text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Loading issues...
                    </td>
                  </tr>
                ) : issues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  issues.map(issue => (
                    <tr key={issue._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectIssue(issue)}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{issue.userId?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{issue.userId?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{issue.category}</td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">{issue.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {[issue.location?.area, issue.location?.city].filter(Boolean).join(', ') || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)}
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectIssue(issue); }}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Issue Detail Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedIssue(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Issue Details</h2>
                    <p className="text-sm text-gray-500">ID: {selectedIssue._id}</p>
                  </div>
                  <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reported By</label>
                    <p className="text-gray-900">{selectedIssue.userId?.name} ({selectedIssue.userId?.email})</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900 capitalize">{selectedIssue.category}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{selectedIssue.description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={updateData.status}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                      className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Resolution Notes</label>
                    <textarea
                      value={updateData.resolutionNotes}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                      rows={3}
                      className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Add notes about resolution..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateIssue}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck size={18} />
                    Update Issue
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteIssue(selectedIssue._id)}
                      className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
