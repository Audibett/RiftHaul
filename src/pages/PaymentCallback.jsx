import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { api } from '../utils/api'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus]   = useState('verifying')
  const [message, setMessage] = useState('')

  const bookingId       = searchParams.get('bookingId')
  const orderTrackingId = searchParams.get('OrderTrackingId')

  useEffect(() => {
    if (!orderTrackingId || !bookingId) {
      setStatus('error')
      setMessage('Missing payment information.')
      return
    }

    api.get(`/api/payments/verify?orderTrackingId=${orderTrackingId}&bookingId=${bookingId}`)
      .then(({ paid, message }) => {
        setStatus(paid ? 'success' : 'failed')
        setMessage(message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.message || 'Verification failed.')
      })
  }, [orderTrackingId, bookingId])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-md w-full">

        {status === 'verifying' && (
          <>
            <Loader className="w-12 h-12 text-brand-orange animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-dark mb-2">Verifying payment...</h2>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-dark mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-2">Your booking <strong>{bookingId}</strong> has been confirmed.</p>
            <p className="text-gray-400 text-sm mb-8">The transporter will contact you shortly to confirm pickup details.</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/bookings"
                className="bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                View My Bookings
              </Link>
              <Link
                to="/transporters"
                className="border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Book Another
              </Link>
            </div>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-dark mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-8">{message || 'Your payment could not be processed. Please try again.'}</p>
            <div className="flex flex-col gap-3">
              <Link
                to={`/bookings`}
                className="bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                Try Again
              </Link>
              <Link
                to="/"
                className="border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Go Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}