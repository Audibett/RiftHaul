import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Package, Truck, TrendingUp, Search,
  CheckCircle, AlertCircle, ArrowRight,
  ShieldOff, Shield, ChevronDown, ChevronUp,
  CreditCard, RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const TABS = ['Overview', 'Users', 'Bookings', 'Transporters', 'Payments']

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  declined:  'bg-gray-100 text-gray-600',
}

const PAYMENT_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const [activeTab, setActiveTab]         = useState('Overview')
  const [stats, setStats]                 = useState(null)
  const [users, setUsers]                 = useState([])
  const [bookings, setBookings]           = useState([])
  const [transporters, setTransporters]   = useState([])
  const [payments, setPayments]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [roleFilter, setRoleFilter]       = useState('all')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [expandedUser, setExpandedUser]   = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage]             = useState({ text: '', type: 'success' })

  useEffect(() => { loadAll() }, [])

  // ── Load all data ──────────────────────────────────────────────
  async function loadAll() {
    setLoading(true)
    try {
      const [statsRes, usersRes, bookingsRes, transportersRes, paymentsRes] =
        await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/users'),
          api.get('/api/admin/bookings'),
          api.get('/api/admin/transporters'),
          api.get('/api/payments/all').catch(() => ({ payments: [] })),
        ])
      setStats(statsRes.stats)
      setUsers(usersRes.users)
      setBookings(bookingsRes.bookings)
      setTransporters(transportersRes.transporters)
      setPayments(paymentsRes.payments || [])
    } catch (err) {
      showMessage('Failed to load data. Please refresh.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Show message helper ────────────────────────────────────────
  function showMessage(text, type = 'success') {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: 'success' }), 3500)
  }

  // ── Suspend / reactivate user ──────────────────────────────────
  async function handleSuspend(userId, currentlySuspended) {
    setActionLoading(`suspend-${userId}`)
    try {
      const { message: msg } = await api.patch(
        `/api/admin/users/${userId}/suspend`,
        { suspended: !currentlySuspended }
      )
      showMessage(msg)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, suspended: !currentlySuspended } : u
        )
      )
      setTransporters((prev) =>
        prev.map((t) =>
          t.userId === userId ? { ...t, suspended: !currentlySuspended } : t
        )
      )
    } catch (err) {
      showMessage(err.message, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Change user role ───────────────────────────────────────────
  async function handleRoleChange(userId, newRole) {
    setActionLoading(`role-${userId}`)
    try {
      const { message: msg } = await api.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole }
      )
      showMessage(msg)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    } catch (err) {
      showMessage(err.message, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Filtered lists ─────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase()
    const matchesSearch =
      !s ||
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s)
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredBookings = bookings.filter((b) => {
    const s = search.toLowerCase()
    const matchesSearch =
      !s ||
      b.customer?.toLowerCase().includes(s) ||
      b.transporter?.toLowerCase().includes(s) ||
      b.from?.toLowerCase().includes(s) ||
      b.to?.toLowerCase().includes(s)
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredPayments = payments.filter((p) => {
    const s = search.toLowerCase()
    return (
      !s ||
      p.customer?.toLowerCase().includes(s) ||
      p.bookingId?.toLowerCase().includes(s)
    )
  })

  const totalCommission = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.commission || 0), 0)

  // ── Access guard ───────────────────────────────────────────────
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-brand-dark mb-2">Access denied</h2>
          <Link to="/" className="text-brand-orange hover:underline text-sm">
            Go home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-xl shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Admin Panel</p>
            <h1 className="text-white font-extrabold text-xl">{user.name}</h1>
          </div>
        </div>
        <button
          onClick={loadAll}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Message banner */}
      {message.text && (
        <div className={`text-sm rounded-xl px-4 py-3 mb-5 border ${
          message.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setSearch('')
              setRoleFilter('all')
              setStatusFilter('all')
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === tab
                ? 'bg-white text-brand-dark shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* ── OVERVIEW TAB ──────────────────────────────────── */}
          {activeTab === 'Overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total users',        value: stats.totalUsers,          color: 'text-brand-dark',   icon: <Users className="w-4 h-4 text-gray-400" /> },
                  { label: 'Customers',          value: stats.totalCustomers,      color: 'text-blue-600',     icon: <Users className="w-4 h-4 text-blue-400" /> },
                  { label: 'Transporters',       value: stats.totalTransporters,   color: 'text-brand-orange', icon: <Truck className="w-4 h-4 text-brand-orange" /> },
                  { label: 'Total bookings',     value: stats.totalBookings,       color: 'text-purple-600',   icon: <Package className="w-4 h-4 text-purple-400" /> },
                  { label: 'Pending',            value: stats.pendingBookings,     color: 'text-yellow-600',   icon: <Package className="w-4 h-4 text-yellow-400" /> },
                  { label: 'In transit',         value: stats.activeBookings,      color: 'text-blue-600',     icon: <Truck className="w-4 h-4 text-blue-400" /> },
                  { label: 'Completed',          value: stats.completedBookings,   color: 'text-green-600',    icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
                  { label: 'Commission earned',  value: `KES ${(totalCommission / 1000).toFixed(1)}k`, color: 'text-brand-orange', icon: <TrendingUp className="w-4 h-4 text-brand-orange" /> },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">{s.icon}</div>
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick navigation */}
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: 'Manage users',      desc: 'Search, suspend, promote',     tab: 'Users' },
                  { label: 'All bookings',       desc: 'Filter by status or route',    tab: 'Bookings' },
                  { label: 'Transporters',       desc: 'Profiles and availability',    tab: 'Transporters' },
                  { label: 'Payments',           desc: 'Commissions and transactions', tab: 'Payments' },
                ].map((q) => (
                  <button
                    key={q.tab}
                    onClick={() => setActiveTab(q.tab)}
                    className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-sm transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-brand-dark text-sm">{q.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{q.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ─────────────────────────────────────── */}
          {activeTab === 'Users' && (
            <div className="space-y-4">
              {/* Search + filter */}
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="all">All roles</option>
                  <option value="customer">Customers</option>
                  <option value="transporter">Transporters</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <p className="text-sm text-gray-500">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </p>

              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                    {/* User row */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                          u.suspended ? 'bg-gray-400' : 'bg-brand-orange'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-brand-dark text-sm truncate">{u.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : u.role === 'transporter'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                            {u.suspended && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
                                Suspended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleSuspend(u.id, u.suspended)}
                            disabled={!!actionLoading}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                              u.suspended
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            } disabled:opacity-50`}
                          >
                            {actionLoading === `suspend-${u.id}` ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : u.suspended ? (
                              <><Shield className="w-3.5 h-3.5" /> Reactivate</>
                            ) : (
                              <><ShieldOff className="w-3.5 h-3.5" /> Suspend</>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setExpandedUser(expandedUser === u.id ? null : u.id)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                        >
                          {expandedUser === u.id
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>

                    {/* Expanded details + role change */}
                    {expandedUser === u.id && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-3 mt-3 text-sm mb-4">
                          <div>
                            <p className="text-gray-400 text-xs">Phone</p>
                            <p className="font-medium text-brand-dark">{u.phone || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Joined</p>
                            <p className="font-medium text-brand-dark">
                              {new Date(u.created_at).toLocaleDateString('en-KE', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">User ID</p>
                            <p className="font-mono text-xs text-gray-500 truncate">{u.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Status</p>
                            <p className={`font-medium text-sm ${u.suspended ? 'text-red-500' : 'text-green-500'}`}>
                              {u.suspended ? 'Suspended' : 'Active'}
                            </p>
                          </div>
                        </div>

                        {/* Role change — only for other users */}
                        {u.id !== user.id && (
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 mb-2 font-medium">
                              Change role
                            </p>
                            <div className="flex gap-2">
                              {['customer', 'transporter', 'admin'].map((r) => (
                                <button
                                  key={r}
                                  onClick={() => handleRoleChange(u.id, r)}
                                  disabled={u.role === r || !!actionLoading}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition capitalize ${
                                    u.role === r
                                      ? 'bg-brand-dark text-white border-brand-dark cursor-default'
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                                  } disabled:opacity-50`}
                                >
                                  {actionLoading === `role-${u.id}` && u.role !== r ? (
                                    <span className="flex items-center justify-center">
                                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    </span>
                                  ) : r}
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Current role:{' '}
                              <span className="font-semibold capitalize text-brand-dark">
                                {u.role}
                              </span>
                            </p>
                          </div>
                        )}

                        {u.id === user.id && (
                          <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3 mt-1">
                            You cannot change your own role or suspend yourself.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BOOKINGS TAB ──────────────────────────────────── */}
          {activeTab === 'Bookings' && (
            <div className="space-y-4">
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer, transporter, route..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="active">In Transit</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <p className="text-sm text-gray-500">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </p>

              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <p className="font-bold text-brand-dark font-mono text-sm">{b.id}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Customer</p>
                        <p className="font-medium text-brand-dark">{b.customer}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Transporter</p>
                        <p className="font-medium text-brand-dark">{b.transporter}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Route</p>
                        <p className="font-medium text-brand-dark">{b.from} → {b.to}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="font-medium text-brand-dark">
                          {new Date(b.date).toLocaleDateString('en-KE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Cargo</p>
                        <p className="font-medium text-brand-dark">{b.cargoType} · {b.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Amount</p>
                        <p className="font-extrabold text-brand-orange">
                          KES {b.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No bookings found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TRANSPORTERS TAB ──────────────────────────────── */}
          {activeTab === 'Transporters' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, truck or location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              <p className="text-sm text-gray-500">
                {transporters.length} transporter{transporters.length !== 1 ? 's' : ''} registered
              </p>

              <div className="space-y-3">
                {transporters
                  .filter((t) => {
                    const s = search.toLowerCase()
                    return (
                      !s ||
                      t.name?.toLowerCase().includes(s) ||
                      t.truck?.toLowerCase().includes(s) ||
                      t.location?.toLowerCase().includes(s)
                    )
                  })
                  .map((t) => (
                    <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                            t.suspended ? 'bg-gray-400' : 'bg-brand-orange'
                          }`}>
                            {t.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-brand-dark text-sm">{t.name}</p>
                              {t.suspended && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                                  Suspended
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              {t.truck} · {t.capacity} · {t.location}
                            </p>
                            <p className="text-xs text-gray-400">{t.email}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-brand-orange font-bold text-sm">
                            KES {t.pricePerKm}/km
                          </p>
                          <p className="text-xs text-gray-400">
                            {t.trips} trips · ⭐ {t.rating}
                          </p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                            t.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {t.available ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      </div>

                      {t.userId && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => handleSuspend(t.userId, t.suspended)}
                            disabled={!!actionLoading}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                              t.suspended
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            } disabled:opacity-50`}
                          >
                            {actionLoading === `suspend-${t.userId}` ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : t.suspended ? (
                              <><Shield className="w-3.5 h-3.5" /> Reactivate</>
                            ) : (
                              <><ShieldOff className="w-3.5 h-3.5" /> Suspend</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                {transporters.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Truck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No transporters yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PAYMENTS TAB ──────────────────────────────────── */}
          {activeTab === 'Payments' && (
            <div className="space-y-4">

              {/* Payment stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                {[
                  { label: 'Total payments',    value: payments.length,                                                      color: 'text-brand-dark' },
                  { label: 'Completed',         value: payments.filter((p) => p.status === 'completed').length,              color: 'text-green-600' },
                  { label: 'Pending',           value: payments.filter((p) => p.status === 'pending').length,                color: 'text-yellow-600' },
                  { label: 'Total commission',  value: `KES ${(totalCommission / 1000).toFixed(1)}k`,                       color: 'text-brand-orange' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer or booking ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              <p className="text-sm text-gray-500">
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
              </p>

              <div className="space-y-3">
                {filteredPayments.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-brand-dark font-mono text-sm">
                          {p.bookingId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.customer}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        PAYMENT_COLORS[p.status] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Commission</p>
                        <p className="font-extrabold text-brand-orange">
                          KES {p.commission?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Phone</p>
                        <p className="font-medium text-brand-dark">{p.phone || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Tracking ID</p>
                        <p className="font-mono text-xs text-gray-500 truncate">
                          {p.pesapalTrackingId || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="font-medium text-brand-dark">
                          {new Date(p.createdAt).toLocaleDateString('en-KE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPayments.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No payments yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Payments will appear here once customers start paying
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}