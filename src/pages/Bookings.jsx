import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, MapPin, Calendar, Truck, ChevronRight,
  Clock, CheckCircle, XCircle, AlertCircle, Plus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  active: {
    label: 'In Transit',
    color: 'bg-blue-100 text-blue-700',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
}

const TABS = ['All', 'Pending', 'In Transit', 'Completed', 'Cancelled']

function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS[booking.status] || STATUS.pending

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className={`h-1 w-full ${
        booking.status === 'completed' ? 'bg-green-400'
        : booking.status === 'active' ? 'bg-blue-400'
        : booking.status === 'cancelled' ? 'bg-red-400'
        : 'bg-yellow-400'
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Booking ID</p>
            <p className="font-extrabold text-brand-dark text-sm">{booking.id}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
            <div className="w-0.5 h-6 bg-gray-200" />
            <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-orange" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-sm font-semibold text-brand-dark leading-none">{booking.from}</p>
            <p className="text-sm text-gray-500 leading-none">{booking.to}</p>
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Truck className="w-4 h-4 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 leading-tight">{booking.truck}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Calendar className="w-4 h-4 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 leading-tight">
              {new Date(booking.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Package className="w-4 h-4 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 leading-tight">{booking.cargoType}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <p className="text-brand-orange font-extrabold text-lg">
            KES {booking.amount.toLocaleString()}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-orange transition font-medium"
          >
            {expanded ? 'Less' : 'Details'}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transporter</span>
              <span className="font-medium text-brand-dark">{booking.transporter}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weight</span>
              <span className="font-medium text-brand-dark">{booking.weight}</span>
            </div>
            {booking.notes && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Notes</span>
                <span className="font-medium text-brand-dark text-right max-w-[60%]">{booking.notes}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {booking.status === 'pending' && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-xl text-xs transition"
                >
                  Cancel Booking
                </button>
              )}
              {booking.status === 'completed' && (
                <Link
                  to="/transporters"
                  className="flex-1 text-center bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 rounded-xl text-xs transition"
                >
                  Book Again
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Bookings() {
  const { user, bookings, addBooking } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [cancelledIds, setCancelledIds] = useState([])

  // Merge cancellations into bookings
  const allBookings = bookings.map((b) =>
    cancelledIds.includes(b.id) ? { ...b, status: 'cancelled' } : b
  )

  const filtered = allBookings.filter((b) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Pending') return b.status === 'pending'
    if (activeTab === 'In Transit') return b.status === 'active'
    if (activeTab === 'Completed') return b.status === 'completed'
    if (activeTab === 'Cancelled') return b.status === 'cancelled'
    return true
  })

  function handleCancel(id) {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancelledIds((prev) => [...prev, id])
    }
  }

  // Counts for tab badges
  const counts = {
    All: allBookings.length,
    Pending: allBookings.filter((b) => b.status === 'pending').length,
    'In Transit': allBookings.filter((b) => b.status === 'active').length,
    Completed: allBookings.filter((b) => b.status === 'completed').length,
    Cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">You're not logged in</h2>
          <p className="text-gray-500 text-sm mb-4">Sign in to view your bookings</p>
          <Link
            to="/login"
            className="bg-brand-orange text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Hi {user.name.split(' ')[0]}, here are your shipments</p>
        </div>
        <Link
          to="/transporters"
          className="flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition"
        >
          <Plus className="w-4 h-4" /> New Booking
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: counts.All, color: 'text-brand-dark' },
          { label: 'Pending', value: counts.Pending, color: 'text-yellow-600' },
          { label: 'In Transit', value: counts['In Transit'], color: 'text-blue-600' },
          { label: 'Completed', value: counts.Completed, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-white text-brand-dark shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No {activeTab.toLowerCase()} bookings</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === 'All' ? "You haven't made any bookings yet" : `No bookings with "${activeTab}" status`}
          </p>
          {activeTab === 'All' && (
            <Link
              to="/transporters"
              className="inline-block mt-4 bg-brand-orange text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition"
            >
              Find a Transporter
            </Link>
          )}
        </div>
      )}
    </div>
  )
}