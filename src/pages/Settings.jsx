import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Truck, Lock, Save, Eye, EyeOff,
  CheckCircle, AlertCircle, Loader,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const cargoTypes = [
  'General', 'Agricultural', 'Electronics',
  'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery',
]

const TABS = {
  customer:    ['Personal Info', 'Password'],
  transporter: ['Personal Info', 'Truck Details', 'Password'],
  admin:       ['Personal Info', 'Password'],
}

function Alert({ type, message }) {
  if (!message) return null
  return (
    <div className={`flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 mb-5 border ${
      type === 'success'
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-red-50 border-red-200 text-red-600'
    }`}>
      {type === 'success'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />
      }
      {message}
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab]     = useState('Personal Info')
  const [profile, setProfile]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [alert, setAlert]             = useState({ type: '', message: '' })

  // Personal info form
  const [personalForm, setPersonalForm] = useState({ name: '', phone: '' })

  // Truck details form
  const [truckForm, setTruckForm] = useState({
    truckType: '', capacity: '', location: '',
    cargoTypes: [], pricePerKm: '', pricePerTonne: '',
  })

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })
  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew, setShowNew]           = useState(false)

  // ── Load profile on mount ────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/login'); return }

    api.get('/api/profile')
      .then(({ profile }) => {
        setProfile(profile)
        setPersonalForm({
          name:  profile.name  || '',
          phone: profile.phone || '',
        })
        if (profile.transporter) {
          setTruckForm({
            truckType:    profile.transporter.truck_type    || '',
            capacity:     profile.transporter.capacity      || '',
            location:     profile.transporter.location      || '',
            cargoTypes:   profile.transporter.cargo_types   || [],
            pricePerKm:   profile.transporter.price_per_km  || '',
            pricePerTonne: profile.transporter.price_per_tonne || '',
          })
        }
      })
      .catch(() => showAlert('error', 'Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [user])

  function showAlert(type, message) {
    setAlert({ type, message })
    setTimeout(() => setAlert({ type: '', message: '' }), 4000)
  }

  function toggleCargo(type) {
    setTruckForm((prev) => ({
      ...prev,
      cargoTypes: prev.cargoTypes.includes(type)
        ? prev.cargoTypes.filter((c) => c !== type)
        : [...prev.cargoTypes, type],
    }))
  }

  // ── Save personal info ───────────────────────────────────────────
  async function savePersonal(e) {
    e.preventDefault()
    if (!personalForm.name.trim()) {
      showAlert('error', 'Name cannot be empty.')
      return
    }
    setSaving(true)
    try {
      await api.patch('/api/profile', {
        name:  personalForm.name.trim(),
        phone: personalForm.phone.trim(),
      })
      showAlert('success', 'Personal info updated successfully.')
    } catch (err) {
      showAlert('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Save truck details ───────────────────────────────────────────
  async function saveTruck(e) {
    e.preventDefault()
    if (!truckForm.truckType.trim()) {
      showAlert('error', 'Truck model is required.')
      return
    }
    setSaving(true)
    try {
      await api.patch('/api/profile/transporter', {
        truckType:    truckForm.truckType,
        capacity:     truckForm.capacity,
        location:     truckForm.location,
        cargoTypes:   truckForm.cargoTypes,
        pricePerKm:   truckForm.pricePerKm,
        pricePerTonne: truckForm.pricePerTonne,
      })
      showAlert('success', 'Truck details updated successfully.')
    } catch (err) {
      showAlert('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Change password ──────────────────────────────────────────────
  async function savePassword(e) {
    e.preventDefault()
    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('error', 'Please fill in all password fields.')
      return
    }
    if (newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New passwords do not match.')
      return
    }

    setSaving(true)
    try {
      await api.patch('/api/profile/password', { currentPassword, newPassword })
      showAlert('success', 'Password changed successfully. Please log in again.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      // Sign out after password change
      setTimeout(() => { logout(); navigate('/login') }, 2000)
    } catch (err) {
      showAlert('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = TABS[user?.role] || TABS.customer

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-dark">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile summary card */}
      <div className="bg-brand-dark rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
          {user?.name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg truncate">{profile?.name}</p>
          <p className="text-gray-400 text-sm truncate">{profile?.email}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize shrink-0 ${
          user?.role === 'admin'
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            : user?.role === 'transporter'
            ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
          {user?.role}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setAlert({ type: '', message: '' })
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === tab
                ? 'bg-white text-brand-dark shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'Personal Info' && <User className="w-4 h-4" />}
            {tab === 'Truck Details' && <Truck className="w-4 h-4" />}
            {tab === 'Password'      && <Lock className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* ── Personal Info Tab ──────────────────────────────────── */}
      {activeTab === 'Personal Info' && (
        <form onSubmit={savePersonal} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-brand-dark text-lg">Personal Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={personalForm.name}
              onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone number
            </label>
            <input
              type="tel"
              value={personalForm.phone}
              onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Account type
            </label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed capitalize"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Member since
            </label>
            <input
              type="text"
              value={profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : '—'
              }
              disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <><Save className="w-4 h-4" /> Save changes</>
            )}
          </button>
        </form>
      )}

      {/* ── Truck Details Tab ──────────────────────────────────── */}
      {activeTab === 'Truck Details' && (
        <form onSubmit={saveTruck} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-brand-dark text-lg">Truck Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Truck model
            </label>
            <input
              type="text"
              value={truckForm.truckType}
              onChange={(e) => setTruckForm({ ...truckForm, truckType: e.target.value })}
              placeholder="e.g. Isuzu FVR, Mitsubishi Canter"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Capacity (tonnes)
            </label>
            <select
              value={truckForm.capacity}
              onChange={(e) => setTruckForm({ ...truckForm, capacity: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition text-gray-700"
            >
              <option value="">Select capacity</option>
              {['1', '2', '3', '5', '7', '10', '15', '20+'].map((c) => (
                <option key={c} value={c}>
                  {c} {c === '20+' ? 'tonnes+' : 'tonnes'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Base location
            </label>
            <input
              type="text"
              value={truckForm.location}
              onChange={(e) => setTruckForm({ ...truckForm, location: e.target.value })}
              placeholder="e.g. Eldoret CBD, Langas"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rate per km (KES)
              </label>
              <input
                type="number"
                value={truckForm.pricePerKm}
                onChange={(e) => setTruckForm({ ...truckForm, pricePerKm: e.target.value })}
                placeholder="e.g. 85"
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rate per tonne (KES)
              </label>
              <input
                type="number"
                value={truckForm.pricePerTonne}
                onChange={(e) => setTruckForm({ ...truckForm, pricePerTonne: e.target.value })}
                placeholder="e.g. 500"
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo types you handle
            </label>
            <div className="flex flex-wrap gap-2">
              {cargoTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleCargo(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    truckForm.cargoTypes.includes(type)
                      ? 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <><Save className="w-4 h-4" /> Save truck details</>
            )}
          </button>
        </form>
      )}

      {/* ── Password Tab ───────────────────────────────────────── */}
      {activeTab === 'Password' && (
        <form onSubmit={savePassword} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-bold text-brand-dark text-lg">Change Password</h2>
          <p className="text-gray-500 text-sm">
            After changing your password you'll be signed out and need to log in again.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm new password
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Re-enter new password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
            />
            {/* Password match indicator */}
            {passwordForm.confirmPassword && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                passwordForm.newPassword === passwordForm.confirmPassword
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}>
                {passwordForm.newPassword === passwordForm.confirmPassword
                  ? <><CheckCircle className="w-3 h-3" /> Passwords match</>
                  : <><AlertCircle className="w-3 h-3" /> Passwords do not match</>
                }
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-dark hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Changing password...
              </>
            ) : (
              <><Lock className="w-4 h-4" /> Change password</>
            )}
          </button>
        </form>
      )}
    </div>
  )
}