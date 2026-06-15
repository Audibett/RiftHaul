import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck, Package, MapPin, Calendar, Star,
  CheckCircle, XCircle, Clock, TrendingUp,
  AlertCircle, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { mockBookings, transporters } from '../data/mockData'

const STATUS = {
  pending:   { label: 'New Request', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', bar: 'bg-yellow-400' },
  active:    { label: 'In Progress', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   bar: 'bg-blue-400' },
  completed: { label: 'Completed',   bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  bar: 'bg-green-400' },
  declined:  { label: 'Declined',    bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    bar: 'bg-red-300' },
}

const TABS = [
  { key: 'all', label: 'All Jobs' },
  { key: 'pending', label: 'New Requests' },
  { key: 'active', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

function JobCard({ job, onAccept, onComplete, onDecline }) {
  const [open, setOpen] = useState(false)
  const s = STATUS[job.status] || STATUS.pending

  return (
    <div className={`bg-white rounded-2xl border ${s.border} overflow-hidden`}>
      <div className={`h-1 ${s.bar}`} />
      <div className="p-5">

        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Job ID</p>
            <p className="font-extrabold text-brand-dark font-mono">{job.id}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
            {job.status === 'pending' && <Clock className="w-3 h-3" />}
            {job.status === 'active' && <Truck className="w-3 h-3" />}
            {job.status === 'completed' && <CheckCircle className="w-3 h-3" />}
            {job.status === 'declined' && <XCircle className="w-3 h-3" />}
            {s.label}
          </span>
        </div>

        {/* Route */}
        <div className="flex gap-3 mb-4">
          <div className="flex flex-col items-center pt-1 gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
            <div className="w-px flex-1 bg-gray-200 min-h-[20px]" />
            <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-orange bg-white" />
          </div>
          <div className="flex flex-col justify-between gap-3 flex-1">
            <p className="text-sm font-semibold text-brand-dark leading-none">{job.from}</p>
            <p className="text-sm text-gray-500 leading-none">{job.to}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Calendar className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500">
              {new Date(job.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Package className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500 truncate">{job.cargoType}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <TrendingUp className="w-3.5 h-3.5 text-brand-orange mx-auto mb-1" />
            <p className="text-xs text-gray-500">{job.weight}</p>
          </div>
        </div>

        {/* Amount + actions */}
        <div className="flex items-center justify-between">
          <p className="text-brand-orange font-extrabold text-xl">KES {job.amount.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            {job.status === 'pending' && (
              <>
                <button
                  onClick={() => onDecline(job.id)}
                  className="px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold rounded-xl text-xs transition"
                >
                  Decline
                </button>
                <button
                  onClick={() => onAccept(job.id)}
                  className="px-4 py-2 bg-brand-orange hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition"
                >
                  Accept
                </button>
              </>
            )}
            {job.status === 'active' && (
              <button
                onClick={() => onComplete(job.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs transition"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Mark complete
              </button>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
            >
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded */}
        {open && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
            {[
              { label: 'Customer', value: 'Alex Waweru' },
              { label: 'Phone', value: '+254 712 000 000' },
              { label: 'Cargo', value: job.cargoType },
              { label: 'Weight', value: job.weight },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-brand-dark">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TransporterDashboard() {
  const { user } = useAuth()
  const profile = transporters[0]
  const [jobs, setJobs] = useState(mockBookings)
  const [isAvailable, setIsAvailable] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const accept = (id) => setJobs((p) => p.map((j) => j.id === id ? { ...j, status: 'active' } : j))
  const complete = (id) => setJobs((p) => p.map((j) => j.id === id ? { ...j, status: 'completed' } : j))
  const decline = (id) => {
    if (window.confirm('Decline this job request?'))
      setJobs((p) => p.map((j) => j.id === id ? { ...j, status: 'declined' } : j))
  }

  const visible = jobs.filter((j) => {
    if (activeTab === 'all') return j.status !== 'declined'
    return j.status === activeTab
  })

  const counts = {
    all: jobs.filter((j) => j.status !== 'declined').length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    active: jobs.filter((j) => j.status === 'active').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  }

  const earnings = jobs.filter((j) => j.status === 'completed').reduce((s, j) => s + j.amount, 0)
  const newRequests = counts.pending

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

      {/* Profile card */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-extrabold text-xl">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-orange" />{profile.truck} · {profile.capacity}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />{profile.location}
              </span>
              <span className="text-yellow-400 text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />{profile.rating} · {profile.trips} trips
              </span>
            </div>
          </div>

          {/* Availability toggle */}
          <div
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition shrink-0 ${
              isAvailable
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div>
              <p className="text-white text-xs font-semibold">Status</p>
              <p className={`text-xs font-bold mt-0.5 ${isAvailable ? 'text-green-400' : 'text-gray-500'}`}>
                {isAvailable ? '● Available' : '○ Off duty'}
              </p>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-600'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total jobs', value: jobs.length, color: 'text-brand-dark', icon: <Package className="w-4 h-4 text-gray-400" /> },
          { label: 'In progress', value: counts.active, color: 'text-blue-600', icon: <Truck className="w-4 h-4 text-blue-400" /> },
          { label: 'Completed', value: counts.completed, color: 'text-green-600', icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
          { label: 'Total earned', value: `KES ${(earnings/1000).toFixed(1)}k`, color: 'text-brand-orange', icon: <TrendingUp className="w-4 h-4 text-brand-orange" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">{s.icon}</div>
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New request alert */}
      {newRequests > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 mb-6">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <p className="text-yellow-800 text-sm font-semibold flex-1">
            {newRequests} new job request{newRequests > 1 ? 's' : ''} waiting for your response
          </p>
          <button
            onClick={() => setActiveTab('pending')}
            className="text-xs font-bold text-yellow-700 hover:underline flex items-center gap-1 shrink-0"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === tab.key ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
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

      {/* Job cards */}
      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map((job) => (
            <JobCard key={job.id} job={job} onAccept={accept} onComplete={complete} onDecline={decline} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-bold text-gray-600">No jobs here yet</p>
          <p className="text-gray-400 text-sm mt-1">New job requests will appear here</p>
        </div>
      )}
    </div>
  )
}