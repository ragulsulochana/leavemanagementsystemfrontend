interface ChartDonutProps {
  data: Array<{ name: string; value: number; color: string }>
  size?: number
}

export const ChartDonut = ({ data, size = 120 }: ChartDonutProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2
  const strokeWidth = 20
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2)
  let cumulative = 0

  const segments = data.map((item) => {
    const strokeDasharray = ((item.value / total) * circumference)
    const strokeDashoffset = circumference - strokeDasharray - cumulative
    cumulative += strokeDasharray
    return { ...item, strokeDasharray, strokeDashoffset }
  })

  return (
    <div className="relative flex size-[120px] items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={segment.strokeDashoffset}
            strokeLinecap="round"
            pathLength={1}
            className="transition-all duration-1000"
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-semibold text-slate-900">{total}</p>
        <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
      </div>
    </div>
  )
}

