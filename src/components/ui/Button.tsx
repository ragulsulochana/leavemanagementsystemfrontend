import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-primary-300',
  secondary: 'border border-border bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:shadow-md',
  danger: 'bg-gradient-to-r from-danger to-red-600 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-red-300',
  ghost: 'border border-transparent bg-transparent text-slate-600 hover:border-border hover:bg-white hover:text-slate-900',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2'
  const disabledClass = disabled ? 'cursor-not-allowed opacity-70' : ''

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
