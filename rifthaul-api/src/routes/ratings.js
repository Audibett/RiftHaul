const router = require('express').Router()
const {
  submitRating,
  getTransporterRatings,
  checkRating,
} = require('../controllers/ratingController')
const { authenticate, requireRole } = require('../middleware/auth')

// Public
router.get('/transporter/:id', getTransporterRatings)

// Customer only
router.post('/',                authenticate, requireRole('customer'), submitRating)
router.get('/check/:bookingId', authenticate, requireRole('customer'), checkRating)

module.exports = router