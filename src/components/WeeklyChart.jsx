import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const WeeklyChart = ({ data, goal }) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    calories: item.calories,
    goal: goal
  }))

  const getBarColor = (value) => {
    if (value === 0) return '#93c5fd' // blue
    const percentage = (value / goal) * 100
    if (percentage > 120) return '#ef4444' // red
    if (percentage > 100) return '#eab308' // yellow
    if (percentage >= 80) return '#22c55e' // green
    return '#3b82f6' // blue
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            className="dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            stroke="#6b7280"
            className="dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#111827'
            }}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <Bar 
            dataKey="calories" 
            fill="#22c55e"
            radius={[8, 8, 0, 0]}
            shape={(props) => {
              const { x, y, width, height, payload } = props
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={getBarColor(payload.calories)}
                  rx={8}
                />
              )
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Far above goal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Above goal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Within goal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Below goal</span>
        </div>
      </div>
    </div>
  )
}

export default WeeklyChart

