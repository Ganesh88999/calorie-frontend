import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { User, Target, Calculator } from 'lucide-react'

const Onboarding = () => {
  const { user, fetchUserProfile } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'prefer-not-to-say',
    dailyCalorieGoal: '',
    doctorDeficitPlan: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.profile?.age) {
      // User already completed onboarding
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateCalorieGoal = () => {
    const age = parseInt(formData.age)
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const gender = formData.gender

    if (!age || !weight || !height) return null

    // Simple BMR calculation (Mifflin-St Jeor Equation)
    let bmr
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 78 // Average
    }

    // Sedentary activity level multiplier
    const tdee = bmr * 1.2
    return Math.round(tdee)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.age || !formData.weight || !formData.height) {
        setError('Please fill in all required fields')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)
    setError('')

    try {
      const goal = formData.dailyCalorieGoal || calculateCalorieGoal() || 2000
      
      await axios.put('/api/user/profile', {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        dailyCalorieGoal: parseInt(goal)
      })

      await fetchUserProfile()
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const suggestedGoal = calculateCalorieGoal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🤖 AI Calorie Assistant Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's personalize your calorie tracking experience
          </p>
        </div>

        <div className="card">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {step} of 3
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((step / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="25"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="70"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="175"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender (Optional)
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Calorie Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Daily Calorie Goal
                </h2>
              </div>

              {suggestedGoal && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 Based on your profile, we suggest <strong>{suggestedGoal} calories</strong> per day.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  name="dailyCalorieGoal"
                  value={formData.dailyCalorieGoal}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={suggestedGoal || "2000"}
                  min="800"
                  max="5000"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use suggested value
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doctor Recommended Deficit Plan (Optional)
                </label>
                <textarea
                  name="doctorDeficitPlan"
                  value={formData.doctorDeficitPlan}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="4"
                  placeholder="Enter your doctor's recommendations here..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Review Your Profile
                </h2>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Age:</span>
                  <span className="font-medium">{formData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                  <span className="font-medium">{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Height:</span>
                  <span className="font-medium">{formData.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="font-medium capitalize">{formData.gender.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Goal:</span>
                  <span className="font-medium">
                    {formData.dailyCalorieGoal || suggestedGoal || 2000} calories
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding

