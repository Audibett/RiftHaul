import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Package, Truck, TrendingUp, Search,
  CheckCircle, XCircle, AlertCircle, ArrowRight,
  ShieldOff, Shield, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const TABS = ['Overview', 'Users', 'Bookings', 'Transporters']

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  declined:  'bg-gray-100 text-gray-600',
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab]       = useState('Overview')
  const [stats, setStats]               = useState(null)
  const [users, setUsers]               = useState([])
  const [bookings, setBookings]         = useState([])
  const [transporters, setTransporters] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [roleFilter, setRoleFilter]     = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedUser, setExpandedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage]           = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [statsRes, usersRes, bookingsRes, transportersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/bookings'),
        api.get('/api/admin/transporters'),
      ])
      setStats(statsRes.stats)
      setUsers(usersRes.users)
      setBookings(bookingsRes.bookings)
      setTransporters(transportersRes.transporters)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSuspend(userId, currentlySuspended) {
    setActionLoading(userId)
    try {
      const { message: msg } = await api.patch(`/api/admin/users/${userId}/suspend`, {
        suspended: !currentlySuspended,
      })
      setMessage(msg)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, suspended: !currentlySuspended } : u
        )
      )
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase()
    const matchesSearch = !s ||
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredBookings = bookings.filter((b) => {
    const s = search.toLowerCase()
    const matchesSearch = !s ||
      b.customer.toLowerCase().includes(s) ||
      b.transporter.toLowerCase().includes(s) ||
      b.from.toLowerCase().includes(s) ||
      b.to.toLowerCase().includes(s)
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-brand-dark mb-2">Access denied</h2>
          <Link to="/" className="text-brand-orange hover:underline text-sm">Go home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Admin Panel</p>
            <h1 className="text-white font-extrabold text-xl">{user.name}</h1>
          </div>
        </div>
        <button
          onClick={loadAll}
          className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-2 rounded-xl transition"
        >
          Refresh data
        </button>
      </div>

      {/* Success/error message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearch(''); setRoleFilter('all'); setStatusFilter('all') }}
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
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {/* ── Overview Tab ────────────────────────────────────── */}
          {activeTab === 'Overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total users',        value: stats.totalUsers,          icon: <Users className="w-4 h-4 text-gray-400" />,         color: 'text-brand-dark' },
                  { label: 'Customers',          value: stats.totalCustomers,      icon: <Users className="w-4 h-4 text-blue-400" />,          color: 'text-blue-600' },
                  { label: 'Transporters',       value: stats.totalTransporters,   icon: <Truck className="w-4 h-4 text-brand-orange" />,      color: 'text-brand-orange' },
                  { label: 'Total bookings',     value: stats.totalBookings,       icon: <Package className="w-4 h-4 text-purple-400" />,      color: 'text-purple-600' },
                  { label: 'Pending bookings',   value: stats.pendingBookings,     icon: <Package className="w-4 h-4 text-yellow-400" />,      color: 'text-yellow-600' },
                  { label: 'Active bookings',    value: stats.activeBookings,      icon: <Truck className="w-4 h-4 text-blue-400" />,          color: 'text-blue-600' },
                  { label: 'Completed bookings', value: stats.completedBookings,   icon: <CheckCircle className="w-4 h-4 text-green-400" />,   color: 'text-green-600' },
                  { label: 'Platform revenue',   value: `KES ${(stats.totalRevenue/1000).toFixed(1)}k`, icon: <TrendingUp className="w-4 h-4 text-brand-orange" />, color: 'text-brand-orange' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">{s.icon}</div>
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Manage users',       desc: 'View, search, suspend accounts',   tab: 'Users' },
                  { label: 'View all bookings',  desc: 'Filter by status, search by name', tab: 'Bookings' },
                  { label: 'View transporters',  desc: 'Check listings and availability',  tab: 'Transporters' },
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

          {/* ── Users Tab ───────────────────────────────────────── */}
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
                    placeholder="Search by name or email..."
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

              <p className="text-sm text-gray-500">{filteredUsers.length} users found</p>

              {/* User cards */}
              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
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

                      <div className="flex items-center gap-2 shrink-0">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleSuspend(u.id, u.suspended)}
                            disabled={actionLoading === u.id}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                              u.suspended
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            {actionLoading === u.id ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : u.suspended ? (
                              <><Shield className="w-3.5 h-3.5" /> Reactivate</>
                            ) : (
                              <><ShieldOff className="w-3.5 h-3.5" /> Suspend</>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                        >
                          {expandedUser === u.id
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedUser === u.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs">Phone</p>
                            <p className="font-medium text-brand-dark">{u.phone || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Joined</p>
                            <p className="font-medium text-brand-dark">
                              {new Date(u.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">User ID</p>
                            <p className="font-mono text-xs text-gray-500 truncate">{u.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Status</p>
                            <p className={`font-medium ${u.suspended ? 'text-red-500' : 'text-green-500'}`}>
                              {u.suspended ? 'Suspended' : 'Active'}
                            </p>
                          </div>
                        </div>
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

          {/* ── Bookings Tab ─────────────────────────────────────── */}
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

              <p className="text-sm text-gray-500">{filteredBookings.length} bookings found</p>

              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-bold text-brand-dark font-mono text-sm">{b.id}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
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
                          {new Date(b.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Cargo</p>
                        <p className="font-medium text-brand-dark">{b.cargoType} · {b.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Amount</p>
                        <p className="font-extrabold text-brand-orange">KES {b.amount?.toLocaleString()}</p>
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

          {/* ── Transporters Tab ─────────────────────────────────── */}
          {activeTab === 'Transporters' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{transporters.length} transporters registered</p>
              <div className="space-y-3">
                {transporters.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                          t.suspended ? 'bg-gray-400' : 'bg-brand-orange'
                        }`}>
                          {t.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-brand-dark text-sm">{t.name}</p>
                            {t.suspended && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                                Suspended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{t.truck} · {t.capacity} · {t.location}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-brand-orange font-bold text-sm">KES {t.pricePerKm}/km</p>
                        <p className="text-xs text-gray-400">{t.trips} trips · ⭐ {t.rating}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                          t.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {t.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>

                    {/* Suspend transporter via their user account */}
                    {t.userId && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleSuspend(t.userId, t.suspended)}
                          disabled={actionLoading === t.userId}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                            t.suspended
                              ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {actionLoading === t.userId ? (
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
        </>
      )}
    </div>
  )
}