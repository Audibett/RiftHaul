import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Truck, LogOut, Menu, X, Package, LayoutDashboard, Search } from 'lucide-react'
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

  const close = () => setMenuOpen(false)
  const isActive = (path) => location.pathname === path

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition-colors ${
        isActive(path) ? 'text-brand-orange' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <>
      <nav className="bg-brand-dark border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={close}>
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">
            Rift<span className="text-brand-orange">Haul</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLink('/transporters', 'Find transporters')}
          {user?.role === 'customer' && navLink('/customer-dashboard', 'Dashboard')}
          {user?.role === 'customer' && navLink('/bookings', 'My bookings')}
          {user?.role === 'transporter' && navLink('/dashboard', 'Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin Panel')}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                <span className="text-xs text-gray-500 capitalize border-l border-white/10 pl-2.5">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 flex items-center justify-center transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white font-medium transition px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={close}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-brand-dark border-l border-white/5 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-extrabold text-white">Rift<span className="text-brand-orange">Haul</span></span>
              </div>
              <button onClick={close} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex-1 px-4 py-4 space-y-1">
              {[
                { to: '/transporters', label: 'Find Transporters', icon: <Search className="w-4 h-4" /> },
                ...(user?.role === 'customer' ? [{ to: '/bookings', label: 'My Bookings', icon: <Package className="w-4 h-4" /> }] : []),
                ...(user?.role === 'transporter' ? [{ to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
              ].map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={close}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(to)
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {icon} {label}
                </Link>
              ))}
            </div>

            {/* Auth actions */}
            <div className="px-4 py-5 border-t border-white/5 space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-xl text-sm transition"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={close} className="block w-full text-center border border-white/10 text-gray-300 hover:bg-white/5 font-semibold py-3 rounded-xl text-sm transition">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={close} className="block w-full text-center bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition">
                    Get started free
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