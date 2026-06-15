import { createContext, useContext, useState } from 'react'
import { mockUser, mockBookings } from '../data/mockData'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState(mockBookings)

  function login(email, password, role) {
    const loggedInUser = {
      ...mockUser,
      email,
      role,
      name: role === 'transporter' ? 'James Kipchoge' : mockUser.name,
    }
    setUser(loggedInUser)
    return loggedInUser
  }

  function register(data) {
    const newUser = {
      name: data.name,
      email: data.email,
      role: data.role,
    }
    setUser(newUser)
    return newUser
  }

  function logout() {
    setUser(null)
  }

  function addBooking(booking) {
    const newBooking = {
      ...booking,
      id: `BK-00${bookings.length + 1}`,
      status: 'pending',
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, bookings, addBooking }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}