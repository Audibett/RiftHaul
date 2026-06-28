import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../utils/api'
import { Truck } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          console.error('No session found:', error?.message)
          navigate('/login')
          return
        }

        // Store token for API calls
        localStorage.setItem('token', session.access_token)

        // Check if this user already has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', session.user.id)
          .maybeSingle()

        if (!profile) {
          // New Google user — create a profile automatically as customer
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id:    session.user.id,
              name:  session.user.user_metadata?.full_name ||
                     session.user.email?.split('@')[0] || 'User',
              phone: '',
              role:  'customer',
            })

          if (insertError) throw insertError

          navigate('/customer-dashboard')
        } else {
          // Existing user — redirect by role
          if (profile.role === 'admin')            navigate('/admin')
          else if (profile.role === 'transporter') navigate('/dashboard')
          else                                     navigate('/customer-dashboard')
        }
      } catch (err) {
        console.error('Auth callback error:', err.message)
        navigate('/login')
      }
    }

    handleCallback()
  }, [])

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
        <p className="text-gray-400 text-sm mt-2">Completing sign in...</p>
      </div>
    </div>
  )
}