import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const cargoTypes = ['General', 'Agricultural', 'Electronics', 'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery']

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    // transporter extras
    truckType: '',
    capacity: '',
    location: '',
    cargoTypes: [],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleCargo(type) {
    setForm((prev) => ({
      ...prev,
      cargoTypes: prev.cargoTypes.includes(type)
        ? prev.cargoTypes.filter((t) => t !== type)
        : [...prev.cargoTypes, type],
    }))
  }

  function handleNext(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.role === 'transporter') {
      setStep(2)
    } else {
      handleSubmit()
    }
  }

  function handleSubmit() {
    setLoading(true)
    setTimeout(() => {
      const user = register(form)
      setLoading(false)
      if (user.role === 'transporter') {
        navigate('/dashboard')
      } else {
        navigate('/transporters')
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <Truck className="text-brand-orange w-8 h-8" />
            <span className="font-extrabold text-2xl text-brand-dark">
              Rift<span className="text-brand-orange">Haul</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark mt-4">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join RiftHaul today — it's free</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Role toggle */}
          {step === 1 && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              {['customer', 'transporter'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition capitalize ${
                    form.role === r
                      ? 'bg-white text-brand-dark shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r === 'customer' ? '📦 I need transport' : '🚛 I have a truck'}
                </button>
              ))}
            </div>
          )}

          {/* Step indicator for transporters */}
          {form.role === 'transporter' && (
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= s ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className="text-xs text-gray-500">
                    {s === 1 ? 'Personal Info' : 'Truck Details'}
                  </span>
                  {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-brand-orange' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Waweru"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition text-sm mt-2"
              >
                {form.role === 'transporter' ? 'Next: Truck Details →' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Step 2: Truck Details (transporters only) */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Truck Model</label>
                <input
                  type="text"
                  name="truckType"
                  value={form.truckType}
                  onChange={handleChange}
                  placeholder="e.g. Isuzu FVR, Mitsubishi Canter"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (tonnes)</label>
                <select
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                >
                  <option value="">Select capacity</option>
                  {['1', '2', '3', '5', '7', '10', '15', '20+'].map((c) => (
                    <option key={c} value={c}>{c} {c === '20+' ? 'tonnes+' : 'tonnes'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Eldoret CBD, Langas"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Types You Handle</label>
                <div className="flex flex-wrap gap-2">
                  {cargoTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleCargo(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.cargoTypes.includes(type)
                          ? 'bg-brand-orange text-white border-brand-orange'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-brand-orange'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-brand-orange hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition text-sm"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}