import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Transporters from './pages/Transporters'
import Bookings from './pages/Bookings'
import NewBooking from './pages/NewBooking'
import TransporterDashboard from './pages/TransporterDashboard'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transporters" element={<Transporters />} />

        {/* Customer only */}
        <Route path="/bookings" element={
          <ProtectedRoute role="customer">
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path="/book/:transporterId" element={
          <ProtectedRoute role="customer">
            <NewBooking />
          </ProtectedRoute>
        } />

        {/* Transporter only */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="transporter">
            <TransporterDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div>
              <p className="text-7xl font-extrabold text-gray-100 mb-4">404</p>
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Page not found</h2>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition text-sm">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App