import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      const user = await login(email, password)
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/'
      navigate(destination, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
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
                <div className="p-6 md:p-8">
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

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-[#FF8C42] text-white font-medium rounded-lg hover:bg-[#ff7a29] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] my-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-[#2ECC71] hover:underline">Create one</Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
