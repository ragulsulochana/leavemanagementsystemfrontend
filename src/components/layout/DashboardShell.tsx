import { ReactNode } from 'react'
import { useAppSelector } from '../../hooks'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

type DashboardShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

const DashboardShell = ({ title, subtitle, children }: DashboardShellProps) => {
  const role = useAppSelector((state) => state.auth.user?.role ?? 'student')

  return (
    <div className="min-h-screen bg-background text-slate-950">
      <Sidebar role={role} />
      <main className="lg:pl-72">
        <Navbar />
        <section className="px-5 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-500">{title}</p>
            {subtitle && <p className="mt-2 max-w-3xl text-sm text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </section>
      </main>
    </div>
  )
}

export default DashboardShell
