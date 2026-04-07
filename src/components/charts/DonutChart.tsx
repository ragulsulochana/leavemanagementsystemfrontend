import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type ChartDatum = {
  name: string
  value: number
  color: string
}

export const DonutChart = ({ data }: { data: ChartDatum[] }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">
            {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
