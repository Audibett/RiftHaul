import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Truck, Calendar, ArrowRight, Plus,
  Clock, CheckCircle, TrendingUp, MapPin, AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS = {
  pending:   { label: 'Pending',    bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  active:    { label: 'In Transit', bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  completed: { label: 'Completed',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400' },
  cancelled: { label: 'Cancelled',  bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400' },
}

function MiniBookingCard({ booking }) {
  const s = STATUS[booking.status] || STATUS.pending
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between mb-3">
        <p className="font-bold text-brand-dark text-sm font-mono">{booking.id}</p>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm mb-2">
        <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
        <span className="text-gray-700 truncate">{booking.from} → {booking.to}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {new Date(booking.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p className="text-brand-orange font-bold text-sm">KES {booking.amount.toLocaleString()}</p>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const { user, bookings, fetchBookings } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchBookings().finally(() => setLoading(false))
  }, [user])

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    active: bookings.filter((b) => b.status === 'active').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0)

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 4)

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">Sign in to view your dashboard</h2>
          <Link to="/login" className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition inline-flex items-center gap-2">
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Welcome header */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h1 className="text-white font-extrabold text-xl">{user.name.split(' ')[0]}</h1>
          </div>
        </div>
        <Link
          to="/transporters"
          className="flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white font-bold px-5 py-3 rounded-xl text-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total bookings', value: counts.total, icon: <Package className="w-4 h-4 text-gray-400" />, color: 'text-brand-dark' },
          { label: 'Pending', value: counts.pending, icon: <Clock className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-600' },
          { label: 'In transit', value: counts.active, icon: <Truck className="w-4 h-4 text-blue-400" />, color: 'text-blue-600' },
          { label: 'Total spent', value: `KES ${(totalSpent / 1000).toFixed(1)}k`, icon: <TrendingUp className="w-4 h-4 text-brand-orange" />, color: 'text-brand-orange' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">{s.icon}</div>
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-dark">Recent bookings</h2>
        {bookings.length > 0 && (
          <Link to="/bookings" className="text-sm text-brand-orange hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : recentBookings.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {recentBookings.map((b) => <MiniBookingCard key={b.id} booking={b} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 mb-8">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-bold text-gray-600">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Book your first transporter to get started</p>
          <Link
            to="/transporters"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Find a transporter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/transporters"
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="font-bold text-brand-dark text-sm">Find a transporter</p>
            <p className="text-gray-400 text-xs mt-0.5">Browse verified drivers near you</p>
          </div>
        </Link>
        <Link
          to="/bookings"
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="font-bold text-brand-dark text-sm">Manage bookings</p>
            <p className="text-gray-400 text-xs mt-0.5">Track, view, or cancel your shipments</p>
          </div>
        </Link>
      </div>
    </div>
  )
}