import axios from 'axios'

// Configure axios defaults
// In production, prefer same-origin so platform rewrites/proxies handle /api/*
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

// Add token to requests if available
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default axios

