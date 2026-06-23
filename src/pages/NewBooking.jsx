import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Weight, Calendar, Truck,
  Star, ChevronRight, CheckCircle, AlertCircle, Package,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const cargoTypes = [
  'General', 'Agricultural', 'Electronics',
  'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery',
]

const STEPS = ['Cargo Details', 'Review & Confirm', 'Confirmed']

const ROUTE_DISTANCES = {
  'Nakuru': 160,
  'Nairobi': 310,
  'Kisumu': 200,
  'Mombasa': 820,
  'Kitale': 65,
  'Kericho': 130,
  'Kakamega': 50,
  'Bungoma': 80,
}

function getEstimatedDistance(destination) {
  const key = Object.keys(ROUTE_DISTANCES).find((k) =>
    destination.toLowerCase().includes(k.toLowerCase())
  )
  return key ? ROUTE_DISTANCES[key] : 150
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < currentStep
                ? 'bg-green-500 text-white'
                : i === currentStep
                ? 'bg-brand-orange text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
              i === currentStep ? 'text-brand-orange' : 'text-gray-400'
            }`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 sm:w-24 h-0.5 mb-4 mx-1 transition-all ${
              i < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function NewBooking() {
  const { transporterId } = useParams()
  const navigate = useNavigate()
  const { user, addBooking } = useAuth()

  const [transporter, setTransporter]         = useState(null)
  const [loadingTransporter, setLoadingTransporter] = useState(true)
  const [fetchError, setFetchError]           = useState('')
  const [step, setStep]                       = useState(0)
  const [form, setForm]                       = useState({
    from: '', to: '', date: '', cargoType: '', weight: '', notes: '',
  })
  const [errors, setErrors]                   = useState({})
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [submitting, setSubmitting]           = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')

  // Fetch the transporter from the API using the ID from the URL
  useEffect(() => {
    if (!transporterId) return
    setLoadingTransporter(true)
    api.get(`/api/transporters/${transporterId}`)
      .then(({ transporter }) => setTransporter(transporter))
      .catch(() => setFetchError('Transporter not found or unavailable.'))
      .finally(() => setLoadingTransporter(false))
  }, [transporterId])

  // ── Price calculation: distance cost + weight cost ────────────────
  const distance = form.to ? getEstimatedDistance(form.to) : 0
  const weightTonnes = parseFloat(form.weight) || 0

  const distanceCost = transporter ? distance * transporter.pricePerKm : 0
  const weightCost = transporter ? weightTonnes * (transporter.pricePerTonne || 0) : 0
  const estimatedAmount = transporter ? Math.round(distanceCost + weightCost) : 0

  const today = new Date().toISOString().split('T')[0]

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.from.trim())  newErrors.from      = 'Pickup location is required'
    if (!form.to.trim())    newErrors.to        = 'Destination is required'
    if (!form.date)         newErrors.date      = 'Pickup date is required'
    if (!form.cargoType)    newErrors.cargoType = 'Please select a cargo type'
    if (!form.weight)       newErrors.weight    = 'Please enter cargo weight'
    return newErrors
  }

  function handleNext() {
    if (!user) { navigate('/login'); return }
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(1)
    window.scrollTo(0, 0)
  }

  async function handleConfirm() {
    setSubmitting(true)
    try {
      const booking = await addBooking({
        transporterProfileId: transporter.id,
        transporterName:      transporter.name,
        truck:                transporter.truck,
        from:                 form.from,
        to:                   form.to,
        date:                 form.date,
        cargoType:            form.cargoType,
        weight:               `${form.weight} tonnes`,
        notes:                form.notes,
        distanceKm:           distance,
      })
      setConfirmedBooking(booking)
      setStep(2)
      window.scrollTo(0, 0)
    } catch (err) {
      alert(err.message || 'Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePay() {
  setPayLoading(true)

  try {
    const { redirectUrl } = await api.post('/api/payments/initiate', {
      bookingId: confirmedBooking?.id,
    })

    window.location.href = redirectUrl
  } catch (err) {
    setPayError(err.message || 'Payment initiation failed.')
    setPayLoading(false)
  }
}

  // ── Loading state ──────────────────────────────────────────────
  if (loadingTransporter) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading transporter...</p>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────
  if (fetchError || !transporter) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            {fetchError || 'Transporter not found'}
          </h2>
          <Link to="/transporters" className="text-brand-orange hover:underline text-sm">
            ← Back to transporters
          </Link>
        </div>
      </div>
    )
  }

  // ── STEP 0: Cargo Details ──────────────────────────────────────
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          to="/transporters"
          className="text-sm text-gray-400 hover:text-brand-orange flex items-center gap-1 mb-6 transition"
        >
          ← Back to transporters
        </Link>

        <StepIndicator currentStep={0} />

        {/* Transporter summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-xl shrink-0">
            {transporter.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-brand-dark">{transporter.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Truck className="w-3 h-3" />
              {transporter.truck} · {transporter.capacity}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-brand-orange font-extrabold">
              KES {transporter.pricePerKm}/km
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              + KES {transporter.pricePerTonne || 0}/tonne
            </p>
            <p className="text-xs text-yellow-500 flex items-center gap-1 justify-end mt-0.5">
              <Star className="w-3 h-3 fill-yellow-400" />
              {transporter.rating}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-brand-dark text-lg">Cargo Details</h2>

          {/* Pickup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="e.g. Eldoret CBD, Langas Market"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400 ${
                  errors.from ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange w-4 h-4" />
              <input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="e.g. Nairobi, Kisumu, Nakuru"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400 ${
                  errors.to ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
            {form.to && (
              <p className="text-xs text-gray-400 mt-1">
                Estimated distance: ~{distance} km
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pickup Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="date"
                value={form.date}
                min={today}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition ${
                  errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Cargo type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo Type
            </label>
            <div className="flex flex-wrap gap-2">
              {cargoTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, cargoType: type }))
                    if (errors.cargoType) setErrors((prev) => ({ ...prev, cargoType: '' }))
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    form.cargoType === type
                      ? 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.cargoType && (
              <p className="text-red-500 text-xs mt-1">{errors.cargoType}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cargo Weight (tonnes)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder={`Max ${transporter.capacity}`}
                min="0.1"
                step="0.1"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400 ${
                  errors.weight ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Notes{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Fragile items, special handling, access instructions..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Price estimate — now shows distance + weight breakdown */}
          {form.to && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Estimated Total</p>
                <p className="text-2xl font-extrabold text-brand-orange">
                  KES {estimatedAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-xs text-gray-400 space-y-0.5">
                <p>
                  Distance: ~{distance} km × KES {transporter.pricePerKm}/km = KES{' '}
                  {Math.round(distanceCost).toLocaleString()}
                </p>
                {weightTonnes > 0 && (
                  <p>
                    Weight: {weightTonnes} tonnes × KES {transporter.pricePerTonne || 0}/tonne = KES{' '}
                    {Math.round(weightCost).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full bg-brand-orange hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            Review Booking <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 1: Review & Confirm ───────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator currentStep={1} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-brand-dark text-lg">Review Your Booking</h2>

          {/* Transporter */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
            <div className="w-11 h-11 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-lg">
              {transporter.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-brand-dark">{transporter.name}</p>
              <p className="text-sm text-gray-500">
                {transporter.truck} · {transporter.capacity}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-gray-100">
            {[
              { label: 'Pickup',      value: form.from },
              { label: 'Destination', value: form.to },
              { label: 'Date',        value: new Date(form.date).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Cargo Type',  value: form.cargoType },
              { label: 'Weight',      value: `${form.weight} tonnes` },
              ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-brand-dark text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown — now shows distance + weight */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Distance cost</span>
              <span>
                ~{distance} km × KES {transporter.pricePerKm} = KES{' '}
                {Math.round(distanceCost).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Weight cost</span>
              <span>
                {weightTonnes} t × KES {transporter.pricePerTonne || 0} = KES{' '}
                {Math.round(weightCost).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-orange-200 pt-2 flex justify-between font-extrabold">
              <span className="text-brand-dark">Total Estimate</span>
              <span className="text-brand-orange text-xl">
                KES {estimatedAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Final price confirmed by transporter at pickup
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              ← Edit
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirming...
                </>
              ) : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP 2: Confirmed ──────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <StepIndicator currentStep={2} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-dark mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-500 mb-1">Your booking ID is</p>
        <p className="text-brand-orange font-extrabold text-xl mb-4">
          {confirmedBooking?.id}
        </p>
        <p className="text-sm text-gray-500 mb-8">
          <strong>{transporter.name}</strong> will contact you to confirm pickup on{' '}
          <strong>
            {new Date(form.date).toLocaleDateString('en-KE', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </strong>.
        </p>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-8">
          {[
            { label: 'From',     value: form.from },
            { label: 'To',       value: form.to },
            { label: 'Cargo',    value: `${form.cargoType} · ${form.weight} tonnes` },
            { label: 'Estimate', value: `KES ${estimatedAmount.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-brand-dark">{value}</span>
            </div>
          ))}
        </div>

        {payError && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
    {payError}
  </div>
)}

<div className="flex flex-col sm:flex-row gap-3">
  <button
    onClick={handlePay}
    disabled={payLoading}
    className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
  >
    {payLoading ? (
      <>
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Redirecting to payment...
      </>
    ) : (
      '💳 Pay Commission Now'
    )}
  </button>

  <Link
    to="/bookings"
    className="flex-1 text-center border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
  >
    Pay Later
  </Link>
</div>
      </div>
    </div>
  )
}