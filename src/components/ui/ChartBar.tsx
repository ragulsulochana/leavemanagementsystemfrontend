interface ChartBarProps {
  data: Array<{ name: string; value: number; color: string }>
}

export const ChartBar = ({ data }: ChartBarProps) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-end gap-3 h-16">
          <div className="min-w-[3rem] flex-1">
            <div 
              className="h-full w-full rounded-xl transition-all duration-1000" 
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{item.value}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

