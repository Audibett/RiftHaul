import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import StarRating from './StarRating'
import { api } from '../utils/api'

export default function TransporterRatings({ transporterProfileId }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!transporterProfileId) return
    api.get(`/api/ratings/transporter/${transporterProfileId}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [transporterProfileId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!data || data.summary.total === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No ratings yet</p>
      </div>
    )
  }

  const { summary, ratings } = data

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">

        {/* Average score */}
        <div className="text-center shrink-0">
          <p className="text-5xl font-extrabold text-brand-dark">
            {summary.average}
          </p>
          <StarRating value={Math.round(summary.average)} readonly size="sm" />
          <p className="text-xs text-gray-400 mt-1">
            {summary.total} review{summary.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 w-full space-y-1.5">
          {summary.distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 w-3">{star}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-gray-400 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {ratings.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {r.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">
                    {r.customerName}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(r.createdAt).toLocaleDateString('en-KE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <StarRating value={r.rating} readonly size="sm" />
            </div>
            {r.comment && (
              <p className="text-gray-600 text-sm leading-relaxed pl-10">
                "{r.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}