import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import StarRating from './StarRating'
import { api } from '../utils/api'

export default function RateBookingModal({ booking, onClose, onSuccess }) {
  const [rating, setRating]   = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) { setError('Please select a star rating.'); return }

    setLoading(true)
    setError('')
    try {
      await api.post('/api/ratings', {
        bookingId: booking.id,
        rating,
        comment,
      })
      setDone(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <>
            <h2 className="text-xl font-extrabold text-brand-dark mb-1">
              Rate your experience
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              How was your delivery with{' '}
              <strong>{booking.transporter}</strong>?
            </p>

            {/* Booking summary */}
            <div className="bg-gray-50 rounded-xl p-3 mb-6 text-sm">
              <p className="text-gray-500 text-xs mb-1">Booking {booking.id}</p>
              <p className="font-medium text-brand-dark">
                {booking.from} → {booking.to}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {booking.cargoType} · {booking.weight}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Star rating */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Tap to rate
                </p>
                <div className="flex justify-center mb-2">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    size="lg"
                  />
                </div>
                {rating > 0 && (
                  <p className={`text-sm font-bold mt-1 ${
                    rating >= 4 ? 'text-green-600'
                    : rating === 3 ? 'text-yellow-600'
                    : 'text-red-500'
                  }`}>
                    {labels[rating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Leave a comment{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Tell other customers about your experience..."
                  maxLength={300}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition resize-none placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {comment.length}/300
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !rating}
                  className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : 'Submit rating'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark mb-2">
              Thank you!
            </h3>
            <p className="text-gray-500 text-sm">
              Your rating has been submitted successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}