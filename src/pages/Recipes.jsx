import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Search, ChefHat } from 'lucide-react'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipes()
  }, [])

  useEffect(() => {
    filterRecipes()
  }, [category, search, recipes])

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes')
      setRecipes(response.data)
      setFilteredRecipes(response.data)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRecipes = () => {
    let filtered = recipes

    if (category !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
      )
    }

    setFilteredRecipes(filtered)
  }

  const handleCategoryChange = async (newCategory) => {
    setCategory(newCategory)
    try {
      const params = newCategory !== 'all' ? { category: newCategory } : {}
      const response = await axios.get('/api/recipes', { params })
      setRecipes(response.data)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading recipes...</div>
      </div>
    )
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="mb-6 btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </button>

          <div className="card">
            <div className="mb-6">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedRecipe.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="capitalize">{selectedRecipe.category === 'veg' ? '🥦 Vegetarian' : '🍗 Non-Vegetarian'}</span>
                <span>•</span>
                <span>{selectedRecipe.calories} calories per serving</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Ingredients
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-primary-600">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Instructions
              </h2>
              <ol className="space-y-4">
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ChefHat className="w-8 h-8" />
              Recipe Finder 🍳
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover healthy and delicious recipes
            </p>
          </div>
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes or ingredients..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('veg')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === 'veg'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                🥦 Veg Only
              </button>
              <button
                onClick={() => handleCategoryChange('non-veg')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === 'non-veg'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                🍗 Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="card text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No recipes found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="card hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {recipe.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="capitalize">
                    {recipe.category === 'veg' ? '🥦 Vegetarian' : '🍗 Non-Vegetarian'}
                  </span>
                  <span>{recipe.calories} cal</span>
                </div>
                <button className="w-full btn-primary text-sm">
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Recipes

