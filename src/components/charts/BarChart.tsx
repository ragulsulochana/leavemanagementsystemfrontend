import { Bar, BarChart as ReBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const BarChart = ({ data }: { data: Array<{ name: string; value: number }> }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#4A90E2" radius={[12, 12, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
