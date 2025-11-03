import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { 
  Plus, 
  Camera, 
  LogOut, 
  Moon, 
  Sun, 
  TrendingUp, 
  Calendar,
  Award,
  Utensils
} from 'lucide-react'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyBadge from '../components/MonthlyBadge'
import FoodEntryModal from '../components/FoodEntryModal'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
  const [entries, setEntries] = useState([])
  const [dailyTotal, setDailyTotal] = useState(0)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('text') // 'text' or 'image'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchTodayEntries()
    fetchWeeklyData()
  }, [])

  const fetchTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await axios.get(`/api/calories/daily/${today}`)
      setEntries(response.data.entries || [])
      setDailyTotal(response.data.totalCalories || 0)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeeklyData = async () => {
    try {
      const response = await axios.get('/api/calories/weekly')
      setWeeklyData(response.data || [])
    } catch (error) {
      console.error('Failed to fetch weekly data:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/calories/${id}`)
      fetchTodayEntries()
      fetchWeeklyData()
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const getCalorieStatus = () => {
    const goal = user?.profile?.dailyCalorieGoal || 2000
    
    if (dailyTotal === 0) {
      return { color: 'blue', icon: '🔵', message: 'Below goal', bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' }
    }
    
    const percentage = (dailyTotal / goal) * 100
    
    if (percentage > 120) {
      return { color: 'red', icon: '🔴', message: 'Far above goal', bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' }
    } else if (percentage > 100) {
      return { color: 'yellow', icon: '🟨', message: 'Slightly above goal', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' }
    } else if (percentage >= 80) {
      return { color: 'green', icon: '🟩', message: 'Within goal', bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' }
    } else {
      return { color: 'blue', icon: '🔵', message: 'Below goal', bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' }
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    document.documentElement.classList.toggle('dark', newMode)
  }

  const status = getCalorieStatus()
  const goal = user?.profile?.dailyCalorieGoal || 2000

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🥗 Calorie Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.email || user?.mobile || 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/recipes"
                className="btn-secondary flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                Recipes
              </Link>
              <button
                onClick={toggleDarkMode}
                className="btn-secondary p-2"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Daily Summary Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Today's Calories
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <MonthlyBadge userId={user?.id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consumed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dailyTotal}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">calories</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Goal</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {goal}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">calories</p>
            </div>

            <div className={`${status.bg} rounded-lg p-4`}>
              <p className="text-sm mb-1">Status</p>
              <p className="text-2xl font-bold mb-1">{status.icon}</p>
              <p className={`text-sm font-medium ${status.text}`}>{status.message}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round((dailyTotal / goal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  status.color === 'red' ? 'bg-red-500' :
                  status.color === 'yellow' ? 'bg-yellow-500' :
                  status.color === 'green' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min((dailyTotal / goal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setModalMode('text')
                setShowModal(true)
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Food (Text)
            </button>
            <button
              onClick={() => {
                setModalMode('image')
                setShowModal(true)
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Add Food (Image)
            </button>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Progress
          </h2>
          <WeeklyChart data={weeklyData} goal={goal} />
        </div>

        {/* Today's Entries */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Food Entries
          </h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No entries yet today. Start tracking your calories!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {entry.foodName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {entry.mealType} • {new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {entry.calories} cal
                    </span>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <FoodEntryModal
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchTodayEntries()
            fetchWeeklyData()
          }}
        />
      )}
    </div>
  )
}

export default Dashboard

