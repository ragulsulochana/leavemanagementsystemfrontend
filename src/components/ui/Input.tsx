import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: ReactNode
}

export const Input = ({ label, icon, className = '', ...props }: InputProps) => {
  return (
    <label className="block text-sm font-medium text-slate-600">
      {label && <span>{label}</span>}
      <div className={label ? 'relative mt-2' : 'relative'}>
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          className={`w-full rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 ${icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
      </div>
    </label>
  )
}
