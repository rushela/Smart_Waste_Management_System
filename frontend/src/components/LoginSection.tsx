import { useState } from 'react';
import { User, Truck, PieChart, Lock, Mail } from 'lucide-react';
export const LoginSection = () => {
  const [selectedRole, setSelectedRole] = useState('resident');
  const roles = [{
    id: 'resident',
    label: 'Resident',
    icon: <User className="h-5 w-5" />
  }, {
    id: 'worker',
    label: 'Worker',
    icon: <Truck className="h-5 w-5" />
  }, {
    id: 'planner',
    label: 'Planner',
    icon: <PieChart className="h-5 w-5" />
  }];
  return <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#2ECC71] p-6 text-white text-center">
            <h2 className="text-2xl font-bold">User Login</h2>
            <p className="text-white/80">
              Access your smart waste management account
            </p>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              {roles.map(role => <button key={role.id} onClick={() => setSelectedRole(role.id)} className={`flex flex-col items-center px-4 py-2 rounded-lg mx-2 transition-all ${selectedRole === role.id ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <div className={`p-2 rounded-full ${selectedRole === role.id ? 'bg-[#2ECC71]/20' : 'bg-gray-100'}`}>
                    {role.icon}
                  </div>
                  <span className="text-sm mt-1">{role.label}</span>
                </button>)}
            </div>
            <form>
              <div className="mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#2ECC71] focus-within:ring-1 focus-within:ring-[#2ECC71]">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="email" placeholder="Email Address" className="flex-1 outline-none text-gray-700" />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#2ECC71] focus-within:ring-1 focus-within:ring-[#2ECC71]">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input type="password" placeholder="Password" className="flex-1 outline-none text-gray-700" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FF8C42] hover:bg-[#e67e3a] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Login
              </button>
              <div className="mt-4 text-center">
                <a href="#" className="text-[#2ECC71] hover:underline text-sm">
                  Forgot password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>;
};