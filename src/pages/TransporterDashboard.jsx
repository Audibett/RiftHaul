import { useState } from 'react'
import {
  Truck, Package, MapPin, Calendar, Star,
  CheckCircle, XCircle, Clock, TrendingUp,
  Phone, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { mockBookings, transporters } from '../data/mockData'
import { Link } from 'react-router-dom'

const JOB_STATUS = {
  pending: { label: 'New Request', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
  active: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <Truck className="w-3.5 h-3.5" /> },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
}

const TABS = ['All Jobs', 'New Requests', 'In Progress', 'Completed']

export default function TransporterDashboard() {
  const { user } = useAuth()

  // Transporter profile (mock: always James Kipchoge)
  const profile = transporters[0]

  const [jobs, setJobs] = useState(
    mockBookings.map((b) => ({ ...b, status: b.status === 'active' ? 'active' : b.status }))
  )
  const [isAvailable, setIsAvailable] = useState(true)
  const [activeTab, setActiveTab] = useState('All Jobs')

  function acceptJob(id) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'active' } : j))
    )
  }

  function completeJob(id) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'completed' } : j))
    )
  }

  function declineJob(id) {
    if (window.confirm('Decline this job request?')) {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: 'declined' } : j))
      )
    }
  }

  const filtered = jobs.filter((j) => {
    if (activeTab === 'All Jobs') return j.status !== 'declined'
    if (activeTab === 'New Requests') return j.status === 'pending'
    if (activeTab === 'In Progress') return j.status === 'active'
    if (activeTab === 'Completed') return j.status === 'completed'
    return true
  })

  const earnings = jobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, j) => sum + j.amount, 0)

  const counts = {
    'All Jobs': jobs.filter((j) => j.status !== 'declined').length,
    'New Requests': jobs.filter((j) => j.status === 'pending').length,
    'In Progress': jobs.filter((j) => j.status === 'active').length,
    'Completed': jobs.filter((j) => j.status === 'completed').length,
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">You're not logged in</h2>
          <Link to="/login" className="bg-brand-orange text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition text-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Profile Header */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-white font-extrabold text-xl">{user.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-brand-orange" />
              {profile.truck} · {profile.capacity}
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              {profile.location}
            </span>
            <span className="text-yellow-400 text-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {profile.rating} · {profile.trips} trips
            </span>
          </div>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
          <div>
            <p className="text-white text-xs font-semibold">Availability</p>
            <p className={`text-xs font-bold ${isAvailable ? 'text-green-400' : 'text-gray-400'}`}>
              {isAvailable ? 'Available for jobs' : 'Not available'}
            </p>
          </div>
          <button onClick={() => setIsAvailable(!isAvailable)}>
            {isAvailable
              ? <ToggleRight className="w-8 h-8 text-green-400" />
              : <ToggleLeft className="w-8 h-8 text-gray-500" />
            }
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Jobs', value: jobs.length, icon: <Package className="w-5 h-5 text-brand-orange" /> },
          { label: 'In Progress', value: counts['In Progress'], icon: <Truck className="w-5 h-5 text-blue-500" /> },
          { label: 'Completed', value: counts.Completed, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
          { label: 'Earnings', value: `KES ${earnings.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              {s.icon}
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <p className="text-xl font-extrabold text-brand-dark">{s.value}</p>
          </div>
        ))}
      </div>

      {/* New request alert */}
      {counts['New Requests'] > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <p className="text-yellow-800 text-sm font-semibold">
            You have {counts['New Requests']} new job request{counts['New Requests'] > 1 ? 's' : ''} waiting for your response
          </p>
          <button
            onClick={() => setActiveTab('New Requests')}
            className="ml-auto text-xs font-bold text-yellow-700 hover:underline shrink-0"
          >
            View →
          </button>
        </div>
      )}

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

      {/* Job cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((job) => {
            const statusMeta = JOB_STATUS[job.status] || JOB_STATUS.pending
            return (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`h-1 w-full ${
                  job.status === 'completed' ? 'bg-green-400'
                  : job.status === 'active' ? 'bg-blue-400'
                  : job.status === 'declined' ? 'bg-red-400'
                  : 'bg-yellow-400'
                }`} />

                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Job ID</p>
                      <p className="font-extrabold text-brand-dark text-sm">{job.id}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta.color}`}>
                      {statusMeta.icon} {statusMeta.label}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                      <div className="w-0.5 h-6 bg-gray-200" />
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-orange" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-brand-dark leading-none">{job.from}</p>
                      <p className="text-sm text-gray-500 leading-none">{job.to}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <Calendar className="w-4 h-4 text-brand-orange mx-auto mb-1" />
                      <p className="text-xs text-gray-500">
                        {new Date(job.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <Package className="w-4 h-4 text-brand-orange mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{job.cargoType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <TrendingUp className="w-4 h-4 text-brand-orange mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{job.weight}</p>
                    </div>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-brand-orange font-extrabold text-lg">
                      KES {job.amount.toLocaleString()}
                    </p>

                    <div className="flex gap-2">
                      {job.status === 'pending' && (
                        <>
                          <button
                            onClick={() => declineJob(job.id)}
                            className="px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold rounded-xl text-xs transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => acceptJob(job.id)}
                            className="px-3 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                          >
                            Accept Job
                          </button>
                        </>
                      )}
                      {job.status === 'active' && (
                        <button
                          onClick={() => completeJob(job.id)}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No jobs in this category</p>
          <p className="text-sm text-gray-400 mt-1">New job requests will appear here</p>
        </div>
      )}
    </div>
  )
}