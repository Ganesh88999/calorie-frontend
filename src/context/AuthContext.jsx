import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        setUser(data.session.user)
        await fetchUserProfile(data.session.user.id)
      }
      setLoading(false)
    }
    getSession()

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // ✅ Profile helpers (Supabase table: profiles)
  const fetchUserProfile = async (uid) => {
    const userId = uid || user?.id
    if (!userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (!error) setProfile(data)
    return data || null
  }

  const updateUserProfile = async (updates) => {
    if (!user?.id) throw new Error('Not authenticated')
    const payload = { user_id: user.id, ...updates }
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  // ✅ Signup with Supabase
  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      console.error('Signup error:', error.message)
      return { success: false, message: error.message }
    }
    setUser(data.user)
    await fetchUserProfile(data.user?.id)
    return { success: true }
  }

  // ✅ Login with Supabase
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.error('Login error:', error.message)
      return { success: false, message: error.message }
    }
    setUser(data.user)
    await fetchUserProfile(data.user?.id)
    return { success: true }
  }

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value = { user, profile, loading, login, signup, logout, fetchUserProfile, updateUserProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

