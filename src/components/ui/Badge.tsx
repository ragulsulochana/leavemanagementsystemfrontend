import { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'success' | 'warning' | 'danger' | 'neutral'
  variant?: 'success' | 'warning' | 'danger' | 'neutral'
  className?: string
}

const badgeStyles: Record<'success' | 'warning' | 'danger' | 'neutral', string> = {
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  neutral: 'bg-slate-100/80 border-slate-200 text-slate-700 border',
}

export const Badge = ({ children, tone, variant, className = '' }: BadgeProps) => {
  const toneValue = tone ?? variant ?? 'neutral'

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeStyles[toneValue]} ${className}`}>
      {children}
    </span>
  )
}
