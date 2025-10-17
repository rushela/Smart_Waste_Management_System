import React, { useEffect, useState } from 'react';
import { Search, User, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { reportService, userService } from '../services/api';

export const UserReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userReport, setUserReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.listUsers({ limit: 100 });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchUserReport = async (userId: string) => {
    try {
      setLoading(true);
      const res = await reportService.getUserReport(userId);
      setUserReport(res.data.data);
    } catch (err) {
      console.error('Error fetching user report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    fetchUserReport(user.id || user._id);
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select User</h3>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id || user._id}
                onClick={() => handleSelectUser(user)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedUser?.id === user.id || selectedUser?._id === user._id
                    ? 'bg-[#2ECC71] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-sm opacity-75">{user.email}</p>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-4">No users found</p>
            )}
          </div>
        </div>

        {/* User Details and Report */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedUser ? (
            <div className="bg-white rounded-lg shadow p-12 border border-gray-200 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a user to view their report</p>
            </div>
          ) : (
            <>
              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedUser.email}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2ECC71]/10 text-[#2ECC71]">
                        {selectedUser.role || 'resident'}
                      </span>
                      {selectedUser.area && (
                        <span className="text-sm text-gray-600">
                          Area: <span className="font-medium">{selectedUser.area}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#2ECC71]/10 p-3 rounded-full">
                    <User className="h-8 w-8 text-[#2ECC71]" />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
                </div>
              ) : userReport ? (
                <>
                  {/* Waste Summary */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 text-[#2ECC71] mr-2" />
                      Waste Generated
                    </h4>
                    {userReport.waste && userReport.waste.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {userReport.waste.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 capitalize">{item.wasteType}</p>
                              <p className="text-2xl font-bold text-gray-800 mt-1">{item.areaWasteTotal} kg</p>
                              <p className="text-xs text-gray-500 mt-1">{item.count} pickups</p>
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={userReport.waste}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="wasteType" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="areaWasteTotal" fill="#2ECC71" name="Weight (kg)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No waste data available</p>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 text-[#FF8C42] mr-2" />
                      Payment History
                    </h4>
                    {userReport.payments && userReport.payments.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {userReport.payments.map((item: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">${item.total}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No payment data available</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 border border-gray-200 text-center">
                  <p className="text-gray-600">No report data available for this user</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
