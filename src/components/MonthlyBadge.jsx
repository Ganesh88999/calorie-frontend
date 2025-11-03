import { useState, useEffect } from 'react'
import axios from 'axios'
import { Award } from 'lucide-react'

const MonthlyBadge = ({ userId }) => {
  const [hasBadge, setHasBadge] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkMonthlyAchievement()
  }, [userId])

  const checkMonthlyAchievement = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const today = new Date()
      
      const response = await axios.get('/api/calories', {
        params: {
          startDate: firstDayOfMonth.toISOString(),
          endDate: today.toISOString()
        }
      })

      const entries = response.data || []
      
      // Group entries by date
      const dailyTotals = {}
      entries.forEach(entry => {
        const dateKey = new Date(entry.date).toISOString().split('T')[0]
        if (!dailyTotals[dateKey]) {
          dailyTotals[dateKey] = 0
        }
        dailyTotals[dateKey] += entry.calories
      })

      // Get user's goal (we'll need to fetch it)
      const userResponse = await axios.get('/api/user/profile')
      const goal = userResponse.data?.profile?.dailyCalorieGoal || 2000

      // Check if user stayed within limits (within 20% of goal) for at least 70% of days
      const daysWithEntries = Object.keys(dailyTotals).length
      const daysWithinLimit = Object.values(dailyTotals).filter(
        total => total >= goal * 0.8 && total <= goal * 1.2
      ).length

      const threshold = Math.max(1, Math.floor(daysWithEntries * 0.7))
      setHasBadge(daysWithinLimit >= threshold && daysWithEntries >= 7)
    } catch (error) {
      console.error('Failed to check monthly achievement:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  if (!hasBadge) return null

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-3 flex items-center gap-2 animate-pulse">
      <Award className="w-6 h-6 text-white" />
      <div>
        <p className="text-sm font-bold text-white">🏅 You're Healthy! 😊</p>
        <p className="text-xs text-white/90">Great job this month!</p>
      </div>
    </div>
  )
}

export default MonthlyBadge

