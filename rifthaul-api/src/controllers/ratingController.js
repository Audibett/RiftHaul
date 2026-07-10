const supabase = require('../db/supabase')

// ── POST /api/ratings ──────────────────────────────────────────────
// Customer submits a rating after a completed booking
async function submitRating(req, res) {
  try {
    const { bookingId, rating, comment } = req.body

    // Validate rating value
    if (!bookingId || !rating) {
      return res.status(400).json({ error: 'Booking ID and rating are required.' })
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5.' })
    }

    // Fetch the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, customer_id, transporter_profile_id, status')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found.' })
    }

    // Only the customer who made the booking can rate
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only rate your own bookings.' })
    }

    // Only completed bookings can be rated
    if (booking.status !== 'completed') {
      return res.status(400).json({
        error: 'You can only rate a booking after it has been completed.',
      })
    }

    // Check if already rated
    const { data: existing } = await supabase
      .from('ratings')
      .select('id')
      .eq('booking_id', bookingId)
      .eq('customer_id', req.user.id)
      .maybeSingle()

    if (existing) {
      return res.status(409).json({
        error: 'You have already rated this booking.',
      })
    }

    // Insert the rating
    const { data, error: insertError } = await supabase
      .from('ratings')
      .insert({
        booking_id:             bookingId,
        customer_id:            req.user.id,
        transporter_profile_id: booking.transporter_profile_id,
        rating:                 Number(rating),
        comment:                comment?.trim() || '',
      })
      .select()
      .single()

    if (insertError) throw insertError

    return res.status(201).json({
      message: 'Rating submitted successfully. Thank you!',
      rating: data,
    })
  } catch (err) {
    console.error('SubmitRating error:', err.message)
    return res.status(500).json({ error: 'Failed to submit rating.' })
  }
}

// ── GET /api/ratings/transporter/:id ──────────────────────────────
// Get all ratings for a specific transporter — public
async function getTransporterRatings(req, res) {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('ratings')
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles!customer_id ( name )
      `)
      .eq('transporter_profile_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const ratings = data.map((r) => ({
      id:         r.id,
      rating:     r.rating,
      comment:    r.comment,
      customerName: r.profiles?.name || 'Anonymous',
      createdAt:  r.created_at,
    }))

    // Calculate summary
    const total  = ratings.length
    const average = total > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0

    // Distribution (how many 1-star, 2-star, etc.)
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count:      ratings.filter((r) => r.rating === star).length,
      percentage: total > 0
        ? Math.round((ratings.filter((r) => r.rating === star).length / total) * 100)
        : 0,
    }))

    return res.status(200).json({
      summary: { average, total, distribution },
      ratings,
    })
  } catch (err) {
    console.error('GetTransporterRatings error:', err.message)
    return res.status(500).json({ error: 'Failed to fetch ratings.' })
  }
}

// ── GET /api/ratings/check/:bookingId ─────────────────────────────
// Check if current customer has already rated a booking
async function checkRating(req, res) {
  try {
    const { bookingId } = req.params

    const { data } = await supabase
      .from('ratings')
      .select('id, rating, comment')
      .eq('booking_id', bookingId)
      .eq('customer_id', req.user.id)
      .maybeSingle()

    return res.status(200).json({
      hasRated: !!data,
      rating:   data || null,
    })
  } catch (err) {
    console.error('CheckRating error:', err.message)
    return res.status(500).json({ error: 'Failed to check rating.' })
  }
}

module.exports = { submitRating, getTransporterRatings, checkRating }