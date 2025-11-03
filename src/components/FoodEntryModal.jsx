import { useState } from 'react'
import axios from 'axios'
import { X, Upload, Loader } from 'lucide-react'

const FoodEntryModal = ({ mode, onClose, onSuccess }) => {
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [mealType, setMealType] = useState('snack')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'image' && !image && !foodName) {
        setError('Please upload an image or enter food name')
        setLoading(false)
        return
      }

      if (mode === 'text' && !foodName) {
        setError('Food name is required')
        setLoading(false)
        return
      }

      if (mode === 'image' && image) {
        // For image mode, create form data
        const formData = new FormData()
        formData.append('image', image)
        formData.append('foodName', foodName || 'Detected Food')
        if (calories) formData.append('calories', calories)
        formData.append('mealType', mealType)

        await axios.post('/api/calories/from-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // For text mode
        await axios.post('/api/calories', {
          foodName,
          calories: calories ? parseInt(calories) : undefined,
          mealType
        })
      }

      onSuccess()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Food Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Food Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        Click to upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 AI will detect the food and estimate calories. You can also enter details manually below.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Name {mode === 'text' && '*'}
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="input-field"
              placeholder="e.g., Grilled Chicken Breast"
              required={mode === 'text'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calories (Optional - will be estimated if not provided)
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="input-field"
              placeholder="e.g., 250"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="input-field"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodEntryModal

