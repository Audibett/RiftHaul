import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'customer' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(user.role === 'transporter' ? '/dashboard' : '/transporters')
  }, [user])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const u = login(form.email, form.password, form.role)
      setLoading(false)
      navigate(u.role === 'transporter' ? '/dashboard' : '/transporters')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left panel — branding (desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-brand-dark px-10 py-12 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Rift<span className="text-brand-orange">Haul</span></span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Move cargo smarter across the Rift Valley.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Join thousands of businesses that trust RiftHaul to connect them with reliable transporters — fast.
          </p>
          <div className="mt-8 space-y-3">
            {['500+ verified transporters', 'Transparent pricing', 'Book in under 3 minutes'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">© 2026 RiftHaul</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-brand-dark text-lg">Rift<span className="text-brand-orange">Haul</span></span>
          </Link>

          <h1 className="text-2xl font-extrabold text-brand-dark mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Role toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[
              { value: 'customer', label: '📦 Customer' },
              { value: 'transporter', label: '🚛 Transporter' },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                  form.role === r.value
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-brand-orange hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-orange font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}