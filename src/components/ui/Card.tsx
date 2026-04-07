import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-2xl border border-border bg-white shadow-md transition-all duration-200 ${className}`}>{children}</div>
  )
}
