import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Weight, Calendar, Truck,
  Star, ChevronRight, CheckCircle, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
    <div className="flex items-center justify-center gap-0 mb-10">
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

  const transporter = transporters.find(
    (t) => t.id === parseInt(transporterId)
  )

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    cargoType: '',
    weight: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  if (!transporter) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-700">Transporter not found</h2>
          <Link to="/transporters" className="text-brand-orange hover:underline mt-2 block">
            ← Back to transporters
          </Link>
        </div>
      </div>
    )
  }

  const distance = getEstimatedDistance(form.to)
  const estimatedAmount = Math.round(distance * transporter.pricePerKm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.from.trim()) newErrors.from = 'Pickup location is required'
    if (!form.to.trim()) newErrors.to = 'Destination is required'
    if (!form.date) newErrors.date = 'Pickup date is required'
    if (!form.cargoType) newErrors.cargoType = 'Please select a cargo type'
    if (!form.weight) newErrors.weight = 'Please enter cargo weight'
    return newErrors
  }

  function handleNext() {
    if (!user) {
      navigate('/login')
      return
    }

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStep(1)
    window.scrollTo(0, 0)
  }

  // ✅ FULL UPDATED FUNCTION (REAL API)
  async function handleConfirm() {
    try {
      const booking = await addBooking({
        transporterProfileId: transporter.id,
        transporterName: transporter.name,
        truck: transporter.truck,
        from: form.from,
        to: form.to,
        date: form.date,
        cargoType: form.cargoType,
        weight: `${form.weight} tonnes`,
        notes: form.notes,
        amount: estimatedAmount,
      })

      setConfirmedBooking(booking)
      setStep(2)
      window.scrollTo(0, 0)
    } catch (err) {
      alert(err.message || 'Failed to create booking')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  // ── STEP 0 ─────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to="/transporters" className="text-sm text-gray-400 hover:text-brand-orange flex items-center gap-1 mb-6">
          ← Back to transporters
        </Link>

        <StepIndicator currentStep={0} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-brand-dark text-lg">Cargo Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              name="from"
              value={form.from}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />
            {errors.from && <p className="text-red-500 text-xs">{errors.from}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              name="to"
              value={form.to}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />
            {errors.to && <p className="text-red-500 text-xs">{errors.to}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              min={today}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl"
          >
            Review Booking
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 1 ─────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator currentStep={1} />

        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold mb-4">Review Booking</h2>

          <p><strong>From:</strong> {form.from}</p>
          <p><strong>To:</strong> {form.to}</p>
          <p><strong>Date:</strong> {form.date}</p>
          <p><strong>Estimate:</strong> KES {estimatedAmount}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(0)}
              className="flex-1 border p-3 rounded-xl"
            >
              Edit
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 bg-brand-orange text-white p-3 rounded-xl"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP 2 ─────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <StepIndicator currentStep={2} />

      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

      <h2 className="text-2xl font-bold">Booking Confirmed</h2>

      <p className="text-gray-500 mt-2">
        Booking ID: {confirmedBooking?.id}
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/bookings" className="flex-1 bg-brand-orange text-white p-3 rounded-xl">
          View Bookings
        </Link>

        <Link to="/transporters" className="flex-1 border p-3 rounded-xl">
          Book Again
        </Link>
      </div>
    </div>
  )
}