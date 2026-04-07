import { CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const LineChart = ({ data }: { data: Array<{ name: string; value: number }> }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4A90E2" strokeWidth={4} dot={{ r: 5, fill: '#4A90E2' }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
