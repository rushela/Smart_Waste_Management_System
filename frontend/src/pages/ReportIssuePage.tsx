import { useState, useEffect } from 'react';
import { IssueForm } from '../components/issues/IssueForm';
import { IssueList } from '../components/issues/IssueList';
import { issueAPI } from '../services/issueApi';
import { Filter } from 'lucide-react';

export function ReportIssuePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const response = await issueAPI.getMine({
        status: filterStatus === 'all' ? undefined : filterStatus
      });
      setIssues(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, [filterStatus]);

  const handleIssueSubmitted = () => {
    fetchMyIssues();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Report an Issue</h1>
          <p className="text-gray-600 text-lg">
            Let us know about any waste management problems in your area
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <IssueForm onSuccess={handleIssueSubmitted} />

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Issue Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {issues.filter((i: any) => i.status === 'Pending').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Pending</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {issues.filter((i: any) => i.status === 'In Progress').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">In Progress</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {issues.filter((i: any) => i.status === 'Resolved').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Resolved</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-3">📞 Need Immediate Help?</h3>
              <p className="text-sm mb-4 text-green-50">
                For urgent waste emergencies, contact our 24/7 hotline
              </p>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <p className="font-mono text-lg font-bold">1-800-WASTE-MGT</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Issues Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Reported Issues</h2>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <IssueList issues={issues} loading={loading} />
        </div>
      </div>
    </div>
  );
}
