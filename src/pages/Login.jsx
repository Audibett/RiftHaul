import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', role: 'customer' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const user = login(form.email, form.password, form.role)
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
          <h1 className="text-2xl font-bold text-brand-dark mt-4">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Role toggle */}
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
                {r === 'customer' ? '📦 Customer' : '🚛 Transporter'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-brand-orange" />
                Remember me
              </label>
              <a href="#" className="text-brand-orange hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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