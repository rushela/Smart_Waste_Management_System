import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Truck,
  BarChart4,
  Lock,
  Mail,
  CheckCircle,
  ArrowLeft,
  UserPlus,
  Phone,
} from 'lucide-react'
// Particle background removed from auth page to prevent layout jitter
import { useAuth } from '../context/AuthContext'

type Role = 'resident' | 'staff' | 'admin'

export function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [selectedRole, setSelectedRole] = useState<Role>('resident')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    householdSize: '',
    workerId: '',
    department: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateForm(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validateStepOne() {
    if (!form.firstName.trim()) return 'First name is required.'
    if (!form.lastName.trim()) return 'Last name is required.'
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) return 'Please provide a valid email address.'
    if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  function validateStepTwo() {
    if (!form.phone.trim()) return 'Phone number is required.'
    if (!form.address.trim()) return 'Address is required.'
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!agreeTerms) return

    try {
      setIsSubmitting(true)
      setError(null)

      // Build payload with all required fields
      const payload: any = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: selectedRole,
        address: form.address.trim(),
        phone: form.phone.trim()
      }

      // Add role-specific fields
      if (selectedRole === 'resident' && form.householdSize) {
        payload.householdSize = form.householdSize
      }

      if (selectedRole === 'staff' && form.workerId) {
        payload.staffId = form.workerId.trim()
      }

      if (selectedRole === 'admin' && form.department) {
        payload.department = form.department
      }

      const registeredUser = await register(payload)
      const destination = registeredUser.role === 'resident' ? '/' : '/admin/dashboard'
      navigate(destination)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-white font-[Inter,sans-serif]">
      <main className="flex-1 pt-24 pb-16">
  <section className="pt-8 pb-12 md:pt-20 md:pb-16 bg-gray-50 min-h-screen flex items-start md:items-center justify-center relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-100 rounded-full opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-[#2ECC71] mb-8 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
              <div className="text-center mb-10">
                <p className="text-[#2ECC71] font-medium mb-2">
                  CREATE ACCOUNT
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Join the Smart Waste Initiative
                </h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Register to access waste management services, track
                  collections, and contribute to a cleaner Sri Lanka
                </p>
              </div>
              <div
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl transform-gpu"
                style={{ willChange: 'transform' }}
              >
                <div className="p-6 md:p-8 overflow-auto max-h-[64vh] md:max-h-[74vh] lg:max-h-[80vh]">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-400'}`}
                      >
                        1
                      </div>
                      <span className="text-xs mt-1 text-gray-600">
                        Account
                      </span>
                    </div>
                    <div className="w-full max-w-[100px] h-1 bg-gray-100 mx-2">
                      <div
                        className={`h-full bg-[#2ECC71] transition-all duration-300`}
                        style={{
                          width: step >= 2 ? '100%' : '0%',
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-400'}`}
                      >
                        2
                      </div>
                      <span className="text-xs mt-1 text-gray-600">
                        Profile
                      </span>
                    </div>
                    <div className="w-full max-w-[100px] h-1 bg-gray-100 mx-2">
                      <div
                        className={`h-full bg-[#2ECC71] transition-all duration-300`}
                        style={{
                          width: step >= 3 ? '100%' : '0%',
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-400'}`}
                      >
                        3
                      </div>
                      <span className="text-xs mt-1 text-gray-600">Verify</span>
                    </div>
                  </div>
                  {/* Role Selector */}
                  <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setSelectedRole('resident')}
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${selectedRole === 'resident' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      <User
                        size={16}
                        className={`mr-2 ${selectedRole === 'resident' ? 'text-[#2ECC71]' : ''}`}
                      />
                      Resident
                    </button>
                    <button
                      onClick={() => setSelectedRole('staff')}
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${selectedRole === 'staff' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      <Truck
                        size={16}
                        className={`mr-2 ${selectedRole === 'staff' ? 'text-[#2ECC71]' : ''}`}
                      />
                      Staff
                    </button>
                    <button
                      onClick={() => setSelectedRole('admin')}
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${selectedRole === 'admin' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      <BarChart4
                        size={16}
                        className={`mr-2 ${selectedRole === 'admin' ? 'text-[#2ECC71]' : ''}`}
                      />
                      Admin
                    </button>
                  </div>
                  {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {/* Signup Form - Step 1 */}
                  {step === 1 && (
                    <form className="space-y-5" onSubmit={(event) => {
                      event.preventDefault()
                      const validationError = validateStepOne()
                      if (validationError) {
                        setError(validationError)
                        return
                      }
                      setError(null)
                      setStep(2)
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="firstname"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            First Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <input
                              value={form.firstName}
                              onChange={(e) => updateForm('firstName', e.target.value)}
                              type="text"
                              id="firstname"
                              className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                              placeholder="First name"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="lastname"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Last Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <input
                              value={form.lastName}
                              onChange={(e) => updateForm('lastName', e.target.value)}
                              type="text"
                              id="lastname"
                              className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                          </div>
                          <input
                            value={form.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            type="email"
                            id="email"
                            className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                          </div>
                          <input
                            value={form.password}
                            onChange={(e) => updateForm('password', e.target.value)}
                            type="password"
                            id="password"
                            className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                            placeholder="Create a password"
                          />
                        </div>
                        <div className="mt-1.5 text-xs text-gray-500">
                          Password must be at least 6 characters long
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                          </div>
                          <input
                            value={form.confirmPassword}
                            onChange={(e) => updateForm('confirmPassword', e.target.value)}
                            type="password"
                            id="confirm-password"
                            className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                            placeholder="Confirm your password"
                          />
                        </div>
                      </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 px-4 bg-[#2ECC71] text-white font-medium rounded-lg hover:bg-[#28b463] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          Continue
                        </button>
                    </form>
                  )}
                  {/* Signup Form - Step 2 */}
                  {step === 2 && (
                    <form className="space-y-5" onSubmit={(event) => {
                      event.preventDefault()
                      const validationError = validateStepTwo()
                      if (validationError) {
                        setError(validationError)
                        return
                      }
                      setError(null)
                      setStep(3)
                    }}>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Phone size={16} className="text-gray-400" />
                          </div>
                          <input
                            value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            type="tel"
                            id="phone"
                            className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Address
                        </label>
                          <textarea
                            value={form.address}
                            onChange={(e) => updateForm('address', e.target.value)}
                            id="address"
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                          placeholder="Enter your address"
                        ></textarea>
                      </div>
                      {selectedRole === 'resident' && (
                        <div>
                          <label
                            htmlFor="household"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Household Size
                          </label>
                          <select
                            value={form.householdSize}
                            onChange={(e) => updateForm('householdSize', e.target.value)}
                            id="household"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 px-4 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                          >
                            <option value="">Select household size</option>
                            <option value="1">1 person</option>
                            <option value="2-3">2-3 people</option>
                            <option value="4-5">4-5 people</option>
                            <option value="6+">6 or more people</option>
                          </select>
                        </div>
                      )}
                      {selectedRole === 'staff' && (
                        <div>
                          <label
                            htmlFor="worker-id"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Staff ID (if available)
                          </label>
                          <input
                            value={form.workerId}
                            onChange={(e) => updateForm('workerId', e.target.value)}
                            type="text"
                            id="worker-id"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 px-4 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                            placeholder="Enter your worker ID"
                          />
                        </div>
                      )}
                      {selectedRole === 'admin' && (
                        <div>
                          <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Department
                          </label>
                          <select
                            value={form.department}
                            onChange={(e) => updateForm('department', e.target.value)}
                            id="department"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 px-4 text-gray-900 focus:border-[#2ECC71] focus:ring-[#2ECC71] focus:ring-1 focus:outline-none text-sm transition-all duration-300"
                          >
                            <option value="">Select department</option>
                            <option value="operations">Operations</option>
                            <option value="planning">Planning</option>
                            <option value="analytics">Analytics</option>
                            <option value="customer-service">
                              Customer Service
                            </option>
                          </select>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(1)
                            setError(null)
                          }}
                          className="py-3.5 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-[#2ECC71] text-white font-medium rounded-lg hover:bg-[#28b463] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          Continue
                        </button>
                      </div>
                    </form>
                  )}
                  {/* Signup Form - Step 3 */}
                  {step === 3 && (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="p-5 bg-green-50 rounded-lg border border-green-100 text-center">
                        <div className="w-16 h-16 mx-auto bg-[#2ECC71] rounded-full flex items-center justify-center mb-4">
                          <UserPlus size={28} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Almost there!
                        </h3>
                        <p className="text-gray-600 mb-0">
                          Please review your information and agree to our terms
                          and conditions.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Account Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account Type:</span>
                            <span className="text-gray-800 font-medium capitalize">
                              {selectedRole}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span className="text-gray-800 font-medium">
                              {`${form.firstName} ${form.lastName}`.trim() || '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="text-gray-800 font-medium">
                              {form.email || '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="text-gray-800 font-medium">
                              {form.phone || '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="text-gray-800 font-medium">
                              {form.address || '—'}
                            </span>
                          </div>
                          {selectedRole === 'resident' && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Household Size:</span>
                              <span className="text-gray-800 font-medium">
                                {form.householdSize || '—'}
                              </span>
                            </div>
                          )}
                          {selectedRole === 'staff' && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Staff ID:</span>
                              <span className="text-gray-800 font-medium">
                                {form.workerId || '—'}
                              </span>
                            </div>
                          )}
                          {selectedRole === 'admin' && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Department:</span>
                              <span className="text-gray-800 font-medium">
                                {form.department || '—'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <button
                          type="button"
                          className={`w-5 h-5 mt-0.5 rounded flex-shrink-0 flex items-center justify-center ${agreeTerms ? 'bg-[#2ECC71]' : 'border border-gray-300'}`}
                          onClick={() => setAgreeTerms(!agreeTerms)}
                          aria-label="Agree to terms"
                        >
                          {agreeTerms && (
                            <CheckCircle size={14} className="text-white" />
                          )}
                        </button>
                        <label className="ml-2 block text-sm text-gray-600">
                          I agree to the{' '}
                          <a
                            href="#"
                            className="text-[#2ECC71] hover:underline"
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href="#"
                            className="text-[#2ECC71] hover:underline"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(2)
                            setError(null)
                          }}
                          className="py-3.5 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!agreeTerms || isSubmitting}
                          className={`py-3.5 px-8 font-medium rounded-lg shadow-md transition-all duration-300 ${agreeTerms && !isSubmitting ? 'bg-[#FF8C42] text-white hover:bg-[#ff7a29] hover:shadow-lg transform hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          {isSubmitting ? 'Creating...' : 'Create Account'}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Already have an account?
                    </p>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-[#2ECC71] hover:text-[#28b463] transition-colors inline-block border-b border-[#2ECC71] pb-0.5"
                    >
                      Sign in instead
                    </Link>
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
