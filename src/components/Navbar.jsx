import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Truck, LogOut, User, Menu, X, Package, LayoutDashboard, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  function close() {
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `transition font-medium text-sm ${
      isActive(path) ? 'text-brand-orange' : 'hover:text-brand-orange text-gray-300'
    }`

  const mobileLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
      isActive(path)
        ? 'bg-brand-orange text-white'
        : 'text-gray-300 hover:bg-gray-800'
    }`

  return (
    <>
      <nav className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <Truck className="text-brand-orange w-6 h-6" />
          <span className="font-extrabold text-xl">
            Rift<span className="text-brand-orange">Haul</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/transporters" className={linkClass('/transporters')}>
            Find Transporters
          </Link>

          {user?.role === 'customer' && (
            <Link to="/bookings" className={linkClass('/bookings')}>
              My Bookings
            </Link>
          )}
          {user?.role === 'transporter' && (
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-gray-400 hover:text-red-400 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link
                to="/register"
                className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={close}>
          <div
            className="absolute top-0 right-0 h-full w-72 bg-brand-dark shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Truck className="text-brand-orange w-5 h-5" />
                <span className="font-extrabold text-white">
                  Rift<span className="text-brand-orange">Haul</span>
                </span>
              </div>
              <button onClick={close} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User badge */}
            {user && (
              <div className="px-5 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-extrabold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <Link to="/transporters" onClick={close} className={mobileLinkClass('/transporters')}>
                <Search className="w-4 h-4" /> Find Transporters
              </Link>

              {user?.role === 'customer' && (
                <Link to="/bookings" onClick={close} className={mobileLinkClass('/bookings')}>
                  <Package className="w-4 h-4" /> My Bookings
                </Link>
              )}
              {user?.role === 'transporter' && (
                <Link to="/dashboard" onClick={close} className={mobileLinkClass('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
            </div>

            {/* Auth actions */}
            <div className="px-4 py-5 border-t border-gray-800 space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-xl text-sm transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={close}
                    className="block w-full text-center border border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold py-3 rounded-xl text-sm transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="block w-full text-center bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}