import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const cargoTypes = ['General', 'Agricultural', 'Electronics', 'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery']

export default function Register() {
  const { register, user, getDashboardPath } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'customer',
    truckType: '', capacity: '', location: '', cargoTypes: [],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(user.role === 'transporter' ? '/dashboard' : '/customer-dashboard', { replace: true })
  }, [user])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
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
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.role === 'transporter') {
      setStep(2)
    } else {
      submit()
    }
  }

  async function submit() {
  setLoading(true)
  try {
    const u = await register(form)
    navigate(getDashboardPath(u.role))
  } catch (err) {
    setError(err.message)
    setStep(1) // send back to step 1 on error
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-brand-dark px-10 py-12 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Rift<span className="text-brand-orange">Haul</span></span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            {form.role === 'transporter'
              ? 'Start earning with your truck.'
              : 'Your cargo, delivered reliably.'}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {form.role === 'transporter'
              ? 'List your truck for free and start getting job requests from businesses across the Rift Valley.'
              : 'Create a free account to book verified transporters, track your shipments, and manage all your deliveries in one place.'}
          </p>
          <div className="space-y-3">
            {(form.role === 'transporter'
              ? ['Free to list your truck', 'Get job requests directly', 'Set your own rates']
              : ['No subscription required', 'Book verified drivers instantly', 'Full booking history']
            ).map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">© 2026 RiftHaul</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-brand-dark text-lg">Rift<span className="text-brand-orange">Haul</span></span>
          </Link>

          <h1 className="text-2xl font-extrabold text-brand-dark mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Free to join — no credit card needed</p>

          {/* Role toggle — step 1 only */}
          {step === 1 && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {[
                { value: 'customer', label: '📦 I need transport' },
                { value: 'transporter', label: '🚛 I have a truck' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition ${
                    form.role === r.value
                      ? 'bg-white text-brand-dark shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Step indicator for transporter */}
          {form.role === 'transporter' && (
            <div className="flex items-center gap-2 mb-6">
              {['Account details', 'Truck info'].map((label, i) => {
                const s = i + 1
                const done = step > s
                const active = step === s
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                      done ? 'bg-green-500 text-white' : active ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : s}
                    </div>
                    <span className={`text-xs font-medium ${active ? 'text-brand-dark' : 'text-gray-400'}`}>{label}</span>
                    {s < 2 && <div className={`flex-1 h-px ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
                  </div>
                )
              })}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Step 1: Account details */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Waweru"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
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
                className="w-full bg-brand-orange hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 mt-2"
              >
                {form.role === 'transporter' ? 'Next: Truck details' : 'Create account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Truck details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Truck model</label>
                <input
                  type="text"
                  name="truckType"
                  value={form.truckType}
                  onChange={handleChange}
                  placeholder="e.g. Isuzu FVR, Mitsubishi Canter"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity</label>
                <select
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition text-gray-700"
                >
                  <option value="">Select capacity</option>
                  {['1', '2', '3', '5', '7', '10', '15', '20+'].map((c) => (
                    <option key={c} value={c}>{c} {c === '20+' ? 'tonnes+' : 'tonnes'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Base location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Eldoret CBD, Langas"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo types you handle</label>
                <div className="flex flex-wrap gap-2">
                  {cargoTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleCargo(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.cargoTypes.includes(type)
                          ? 'bg-brand-orange text-white border-brand-orange'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 bg-white text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}