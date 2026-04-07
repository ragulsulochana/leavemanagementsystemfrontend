const steps = ['Student', 'Staff', 'HOD', 'Principal']

export const TimelineStepper = ({ active = 'Staff' }: { active?: string }) => {
  const activeIndex = steps.indexOf(active)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.map((step, index) => {
        const complete = index <= activeIndex
        return (
          <div key={step} className="relative rounded-2xl border border-border bg-slate-50 p-4">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${complete ? 'bg-primary-500 text-white' : 'bg-white text-slate-400'}`}>
              {index + 1}
            </div>
            <p className="font-bold text-slate-900">{step}</p>
            <p className="mt-1 text-xs text-slate-500">{complete ? 'Completed or active' : 'Waiting'}</p>
          </div>
        )
      })}
    </div>
  )
}
