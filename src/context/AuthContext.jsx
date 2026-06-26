import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)

  // On app load — restore session from Supabase
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token)
        api.get('/api/auth/me')
          .then(({ user }) => setUser(user))
          .catch(() => {
            localStorage.removeItem('token')
            supabase.auth.signOut()
          })
          .finally(() => setLoading(false))
      } else {
        localStorage.removeItem('token')
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setBookings([])
          localStorage.removeItem('token')
        }
        if (event === 'TOKEN_REFRESHED' && session) {
          localStorage.setItem('token', session.access_token)
        }
        if (event === 'PASSWORD_RECOVERY') {
          // Handled in reset password page
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Helper: get correct dashboard path by role ─────────────────
  function getDashboardPath(role) {
    if (role === 'admin')       return '/admin'
    if (role === 'transporter') return '/dashboard'
    return '/customer-dashboard'
  }

  // ── Login ──────────────────────────────────────────────────────
  async function login(email, password, role) {
    const { token, user } = await api.post('/api/auth/login', {
      email, password, role,
    })
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  // ── Register ───────────────────────────────────────────────────
  async function register(data) {
    const { token, user } = await api.post('/api/auth/register', {
      name:       data.name,
      email:      data.email,
      phone:      data.phone,
      password:   data.password,
      role:       data.role,
      truckType:  data.truckType,
      capacity:   data.capacity,
      location:   data.location,
      cargoTypes: data.cargoTypes,
    })
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  // ── Logout ─────────────────────────────────────────────────────
  async function logout() {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    setUser(null)
    setBookings([])
  }

  // ── Forgot password ────────────────────────────────────────────
  async function forgotPassword(email) {
    const { message } = await api.post('/api/auth/forgot-password', { email })
    return message
  }

  // ── Reset password ─────────────────────────────────────────────
  async function resetPassword(password, accessToken) {
    const { message } = await api.post('/api/auth/reset-password', {
      password,
      accessToken,
    })
    return message
  }

  // ── Fetch customer bookings ────────────────────────────────────
  async function fetchBookings() {
    const { bookings } = await api.get('/api/bookings/my')
    setBookings(bookings)
    return bookings
  }

  // ── Add a new booking ──────────────────────────────────────────
  async function addBooking(bookingData) {
    const { booking } = await api.post('/api/bookings', bookingData)
    setBookings((prev) => [booking, ...prev])
    return booking
  }

  // ── Update booking status ──────────────────────────────────────
  async function updateBookingStatus(id, status) {
    const { booking } = await api.patch(`/api/bookings/${id}/status`, { status })
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)))
    return booking
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      bookings,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      fetchBookings,
      addBooking,
      updateBookingStatus,
      getDashboardPath,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}