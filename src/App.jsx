import AdminDashboard from './pages/AdminDashboard'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Transporters from './pages/Transporters'
import Bookings from './pages/Bookings'
import NewBooking from './pages/NewBooking'
import CustomerDashboard from './pages/CustomerDashboard'
import TransporterDashboard from './pages/TransporterDashboard'
import { Truck } from 'lucide-react'
import PaymentCallback from './pages/PaymentCallback'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="flex items-center gap-2 justify-center">
            <Truck className="w-5 h-5 text-brand-orange" />
            <span className="font-extrabold text-brand-dark text-lg">
              Rift<span className="text-brand-orange">Haul</span>
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/transporters" element={<Transporters />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />

        {/* Customer only */}
        <Route path="/customer-dashboard" element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } />
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

        <Route path="/admin" element={
         <ProtectedRoute role="admin">
           <AdminDashboard />
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
          <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
            <div>
              <p className="text-8xl font-extrabold text-gray-100 mb-4">404</p>
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Page not found</h2>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
                Go home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App