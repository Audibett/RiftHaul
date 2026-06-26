import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../utils/api'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }

      localStorage.setItem('token', session.access_token)

      try {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          // New Google user — create a profile
          await supabase.from('profiles').insert({
            id:    session.user.id,
            name:  session.user.user_metadata?.full_name || 'User',
            phone: '',
            role:  'customer',
          })
          navigate('/customer-dashboard')
        } else {
          // Existing user — redirect by role
          if (profile.role === 'admin')       navigate('/admin')
          else if (profile.role === 'transporter') navigate('/dashboard')
          else navigate('/customer-dashboard')
        }
      } catch (err) {
        console.error(err)
        navigate('/login')
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}