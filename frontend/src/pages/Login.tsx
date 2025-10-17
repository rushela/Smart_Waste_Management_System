import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Truck, BarChart4, Lock, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
// Particle background removed from auth page to prevent layout jitter

type Role = 'resident' | 'staff' | 'worker' | 'admin'

export function Login() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [role, setRole] = useState<Role>('resident')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validate() {
    if (!email) return 'Email is required.'
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Please enter a valid email.'
    if (!password) return 'Password is required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const authenticatedUser = await login(email, password)

      // Allow both 'worker' and 'staff' roles to be treated as staff
      const userRole = authenticatedUser.role === 'worker' ? 'staff' : authenticatedUser.role

      if (userRole !== role) {
        setError('Selected role does not match your account role.')
        logout()
        return
      }

      // Route staff/worker to worker dashboard, others to their respective dashboards
      let destination = '/'
      if (authenticatedUser.role === 'staff' || authenticatedUser.role === 'worker') {
        destination = '/worker/dashboard'
      } else if (authenticatedUser.role === 'admin') {
        destination = '/admin/dashboard'
      } else {
        destination = '/' // resident
      }
      
      navigate(destination)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-[Inter,sans-serif]">
      <main className="flex-1 pt-24 pb-16">
  <section className="pt-8 pb-12 md:pt-20 md:pb-16 bg-gray-50 min-h-screen flex items-start md:items-center justify-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-30" aria-hidden />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-100 rounded-full opacity-30" aria-hidden />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-lg mx-auto">
              <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#2ECC71] mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>

              <div className="text-center mb-10">
                <p className="text-[#FF8C42] font-medium mb-2">WELCOME BACK</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Log in to your account</h1>
                <p className="text-gray-600 max-w-md mx-auto">Access your smart waste management dashboard and services</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform-gpu" style={{ willChange: 'transform' }}>
                <div className="p-6 md:p-8 overflow-auto max-h-[60vh] md:max-h-[72vh] lg:max-h-[78vh]">
                  {/* Role selector as accessible radios */}
                  <fieldset className="mb-6">
                    <legend className="sr-only">Select role</legend>
                    <div className="flex bg-gray-100 p-1 rounded-lg" role="radiogroup" aria-label="Select role">
                      <label className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm cursor-pointer ${role === 'resident' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="resident"
                          checked={role === 'resident'}
                          onChange={() => setRole('resident')}
                          className="sr-only"
                        />
                        <User size={16} className={`mr-2 ${role === 'resident' ? 'text-[#2ECC71]' : ''}`} />
                        Resident
                      </label>
                      <label className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm cursor-pointer ${role === 'staff' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="staff"
                          checked={role === 'staff'}
                          onChange={() => setRole('staff')}
                          className="sr-only"
                        />
                        <Truck size={16} className={`mr-2 ${role === 'staff' ? 'text-[#2ECC71]' : ''}`} />
                        Staff
                      </label>
                      <label className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm cursor-pointer ${role === 'admin' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={role === 'admin'}
                          onChange={() => setRole('admin')}
                          className="sr-only"
                        />
                        <BarChart4 size={16} className={`mr-2 ${role === 'admin' ? 'text-[#2ECC71]' : ''}`} />
                        Admin
                      </label>
                    </div>
                  </fieldset>

                  <form onSubmit={onSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          id="email"
                          className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <a href="#" className="text-xs font-medium text-[#2ECC71] hover:text-[#28b463] transition-colors">Forgot password?</a>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          id="password"
                          className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-[#FF8C42] text-white font-medium rounded-lg hover:bg-[#ff7a29] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] my-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
                    <Link to="/signup" className="text-sm font-medium text-[#2ECC71] hover:text-[#28b463] transition-colors inline-block border-b border-[#2ECC71] pb-0.5">Register now</Link>
                  </div>

                  {/* Social Login Options */}
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 border-t border-gray-200" />
                      <div className="text-sm text-gray-500">or continue with</div>
                      <div className="flex-1 border-t border-gray-200" />
                    </div>
                    <div className="flex gap-3">
                      <button aria-label="Continue with Google" className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
                      </button>
                      <button aria-label="Continue with Facebook" className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                      <button aria-label="Continue with Twitter" className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><path d="M22.2125 5.65605C21.4491 5.99375 20.6395 6.21555 19.8106 6.31411C20.6839 5.79132 21.3374 4.9689 21.6493 4.00005C20.8287 4.48761 19.9305 4.83077 18.9938 5.01461C18.2031 4.17106 17.098 3.69303 15.9418 3.69434C13.6326 3.69434 11.7597 5.56661 11.7597 7.87683C11.7597 8.20458 11.7973 8.52242 11.8676 8.82909C8.39047 8.65404 5.31007 6.99005 3.24678 4.45941C2.87529 5.09767 2.68005 5.82318 2.68104 6.56167C2.68104 8.01259 3.4196 9.29324 4.54149 10.043C3.87737 10.022 3.22788 9.84264 2.64718 9.51973C2.64654 9.5373 2.64654 9.55487 2.64654 9.57148C2.64654 11.5984 4.08819 13.2892 6.00199 13.6731C5.64336 13.7703 5.27324 13.8194 4.90099 13.8191C4.62996 13.8191 4.36772 13.7942 4.11457 13.7453C4.64532 15.4065 6.18886 16.6159 8.0196 16.6491C6.53813 17.8118 4.70869 18.4426 2.82543 18.4399C2.49212 18.4402 2.15909 18.4205 1.82812 18.3811C3.74004 19.6102 5.96552 20.2625 8.23842 20.2601C15.9316 20.2601 20.138 13.8875 20.138 8.36111C20.138 8.1803 20.1336 7.99886 20.1256 7.81997C20.9443 7.22845 21.651 6.49567 22.2125 5.65605Z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
