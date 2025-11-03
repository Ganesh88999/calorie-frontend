import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, mobile, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        mobile,
        password
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const signup = async (email, mobile, password) => {
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        mobile,
        password
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    fetchUserProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

