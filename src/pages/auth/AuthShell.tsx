import { ReactNode } from 'react'

type AuthShellProps = {
  children: ReactNode
  title: string
  subtitle: string
  variant?: 'login' | 'signup'
}

export const AuthShell = ({ children, title, subtitle, variant = 'login' }: AuthShellProps) => {
  if (variant === 'signup') {
    return (
      <div className="min-h-screen overflow-hidden bg-[#F6F8F3] p-4 text-slate-950">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-between rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-12">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-emerald-200">New workspace</div>
              <h1 className="mt-8 max-w-lg text-5xl font-black leading-tight">Start with the right role.</h1>
              <p className="mt-5 max-w-md text-slate-300">Create an account for students, staff, HODs, or principal access. Each role gets a different dashboard experience.</p>
            </div>
            <div className="mt-10 grid gap-3">
              {['Student applies leave', 'Staff reviews first', 'HOD checks department', 'Principal finalizes'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-black text-slate-950">{index + 1}</span>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center rounded-[2rem] border border-white bg-white/80 p-6 shadow-xl backdrop-blur sm:p-10">
            <div className="w-full max-w-xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-600">{title}</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950">{subtitle}</h2>
              <div className="mt-8">{children}</div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(74,144,226,0.35),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_24rem)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden p-12 lg:block">
          <div className="absolute inset-x-12 top-14 h-40 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500 text-3xl font-black shadow-xl shadow-blue-500/30">L</div>
              <h1 className="mt-10 max-w-2xl text-6xl font-black leading-none">Secure leave access, fast.</h1>
              <p className="mt-6 max-w-lg text-lg text-slate-300">Login to continue to the dashboard mapped to your role and approval permissions.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white p-6 text-slate-950 sm:p-10">
          <div className="w-full max-w-md">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-600">{title}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">{subtitle}</h2>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
