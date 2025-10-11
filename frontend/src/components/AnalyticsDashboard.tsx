import { BarChart, PieChart, Activity, TrendingUp } from 'lucide-react';
export const AnalyticsDashboard = () => {
  return <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Live Analytics Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time data visualization helps planners make informed decisions.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 backdrop-blur-sm bg-white/80 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Waste Collected Today */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Waste Collected
                  </h3>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
                <BarChart className="h-6 w-6 text-[#2ECC71]" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-800">12.8</span>
                <span className="ml-1 text-gray-600">tons</span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-[#2ECC71] mr-1" />
                <span className="text-[#2ECC71] font-medium">
                  +8% from yesterday
                </span>
              </div>
            </div>
            {/* Recycling Rate */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recycling Rate
                  </h3>
                  <p className="text-sm text-gray-500">This week</p>
                </div>
                <PieChart className="h-6 w-6 text-[#2ECC71]" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-800">34%</span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-[#2ECC71] mr-1" />
                <span className="text-[#2ECC71] font-medium">
                  +2% from last week
                </span>
              </div>
            </div>
            {/* Pending Complaints */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Pending Complaints
                  </h3>
                  <p className="text-sm text-gray-500">Active issues</p>
                </div>
                <Activity className="h-6 w-6 text-[#FF8C42]" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-800">7</span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-[#FF8C42] font-medium">
                  3 high priority
                </span>
              </div>
            </div>
          </div>
          {/* Mock Chart */}
          <div className="mt-8 bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Collection Trends
            </h3>
            <div className="h-48 w-full bg-gradient-to-r from-green-100 via-green-200 to-green-100 rounded-lg flex items-end p-4">
              <div className="h-60% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-40% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-70% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-50% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-90% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-60% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
              <div className="h-30% w-1/7 bg-[#2ECC71] rounded-t-md mx-1"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};