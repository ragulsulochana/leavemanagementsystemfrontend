import { Card } from '../ui/Card'

type KPIcardProps = {
  label: string
  value: string | number
  helper: string
  tone?: 'blue' | 'green' | 'yellow' | 'red'
}

const toneClass = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-emerald-500 to-teal-500',
  yellow: 'from-amber-500 to-orange-500',
  red: 'from-rose-500 to-red-500',
}

export const KPIcard = ({ label, value, helper, tone = 'blue' }: KPIcardProps) => {
  return (
    <Card className="group p-6 hover:-translate-y-1 hover:shadow-xl">
      <div className={`mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br ${toneClass[tone]} shadow-lg`} />
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </Card>
  )
}
