import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Truck, Calendar, ChevronDown, ChevronUp,
  Clock, CheckCircle, XCircle, Plus, AlertCircle, ArrowRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS = {
  pending:   { label: 'Pending',    bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400', bar: 'bg-yellow-400' },
  active:    { label: 'In Transit', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400',   bar: 'bg-blue-400' },
  completed: { label: 'Completed',  bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-400',  bar: 'bg-green-400' },
  cancelled: { label: 'Cancelled',  bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-400',    bar: 'bg-red-300' },
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'In Transit' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

function BookingCard({ booking, onCancel }) {
  const [open, setOpen] = useState(false)
  const s = STATUS[booking.status] || STATUS.pending

  return (
    <div className={`bg-white rounded-2xl border ${s.border} overflow-hidden transition-shadow hover:shadow-sm`}>
      {/* Color bar */}
      <div className={`h-1 ${s.bar}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
            <p className="font-extrabold text-brand-dark font-mono">{booking.id}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>

        {/* Route visual */}
        <div className="flex gap-3 mb-4">
          <div className="flex flex-col items-center pt-1 gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
            <div className="w-px flex-1 bg-gray-200 min-h-[20px]" />
            <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-orange bg-white" />
          </div>
          <div className="flex flex-col justify-between flex-1 gap-3">
            <p className="text-sm font-semibold text-brand-dark leading-none">{booking.from}</p>
            <p className="text-sm text-gray-500 leading-none">{booking.to}</p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Truck className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 truncate">{booking.truck}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Calendar className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500">
              {new Date(booking.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Package className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 truncate">{booking.cargoType}</p>
          </div>
        </div>

        {/* Amount + expand toggle */}
        <div className="flex items-center justify-between">
          <p className="text-brand-orange font-extrabold text-xl">
            KES {booking.amount.toLocaleString()}
          </p>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-orange transition font-medium"
          >
            {open ? 'Hide' : 'Details'}
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded section */}
        {open && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {[
              { label: 'Transporter', value: booking.transporter },
              { label: 'Weight', value: booking.weight },
              ...(booking.notes ? [{ label: 'Notes', value: booking.notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-brand-dark text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            {booking.status === 'pending' && (
              <button
                onClick={() => onCancel(booking.id)}
                className="w-full mt-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Cancel this booking
              </button>
            )}
            {booking.status === 'completed' && (
              <Link
                to="/transporters"
                className="flex items-center justify-center gap-1.5 w-full mt-2 bg-brand-orange hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Book again <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Bookings() {
  const { user, bookings } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [cancelledIds, setCancelledIds] = useState([])

  const allBookings = bookings.map((b) =>
    cancelledIds.includes(b.id) ? { ...b, status: 'cancelled' } : b
  )

  const filtered = allBookings.filter((b) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return b.status === 'active'
    return b.status === activeTab
  })

  const counts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === 'pending').length,
    active: allBookings.filter((b) => b.status === 'active').length,
    completed: allBookings.filter((b) => b.status === 'completed').length,
    cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
  }

  function handleCancel(id) {
    if (window.confirm('Cancel this booking? This cannot be undone.')) {
      setCancelledIds((prev) => [...prev, id])
    }
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">Sign in to view bookings</h2>
          <p className="text-gray-500 text-sm mb-6">Your booking history will appear here once you're logged in.</p>
          <Link to="/login" className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition inline-flex items-center gap-2">
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Hi {user.name.split(' ')[0]}, here are your shipments</p>
        </div>
        <Link
          to="/transporters"
          className="flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total', value: counts.all, color: 'text-brand-dark' },
          { label: 'Pending', value: counts.pending, color: 'text-yellow-600' },
          { label: 'In Transit', value: counts.active, color: 'text-blue-600' },
          { label: 'Completed', value: counts.completed, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === tab.key
                ? 'bg-white text-brand-dark shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-bold text-gray-600">No {activeTab === 'all' ? '' : activeTab + ' '}bookings</p>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'all' ? "You haven't made any bookings yet." : `Nothing here yet.`}
          </p>
          {activeTab === 'all' && (
            <Link
              to="/transporters"
              className="inline-flex items-center gap-2 mt-5 bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
            >
              Find a transporter <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}