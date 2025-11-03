import { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

const Disclaimer = () => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300 flex-1">
            ⚠️ <strong>Important:</strong> Please consult a dietician or doctor before following a calorie deficit plan. This app is meant only for tracking your food intake.
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer

