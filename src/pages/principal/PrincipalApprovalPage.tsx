import { useEffect } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import DashboardShell from '../../components/layout/DashboardShell'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveLeave, fetchLeaves, rejectLeave } from '../../redux/slices/leaveSlice'

export const PrincipalApprovalPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error, success } = useAppSelector((state) => state.leave)
  const finalList = items.filter((item) => item.status === 'hodApproved')

  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  return (
    <DashboardShell title="Principal approvals" subtitle="Final decision cards for HOD-approved leave requests.">
      <div className="space-y-6">
        {(success || error) && <div className={`rounded-2xl border p-4 text-sm font-semibold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}
        {loading && <p className="text-sm font-semibold text-slate-500">Loading final approvals...</p>}
        <div className="grid gap-5">
          {finalList.map((leave) => (
            <Card key={leave.id} className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-950">{leave.studentName}</h2>
                    <Badge tone="warning">{leave.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{leave.department} | {leave.fromDate} to {leave.toDate}</p>
                  <p className="mt-4 text-sm text-slate-700">{leave.reason}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em]">
                    {['Student', 'Staff', 'HOD', 'Principal'].map((step) => (
                      <span key={step} className={`rounded-full px-3 py-2 ${step === 'Principal' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{step}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => dispatch(approveLeave(leave.id))} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md">Approve</button>
                  <button type="button" onClick={() => dispatch(rejectLeave(leave.id))} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-md">Reject</button>
                </div>
              </div>
            </Card>
          ))}
          {finalList.length === 0 && !loading && <Card className="p-10 text-center text-sm text-slate-500">No HOD-approved requests are waiting.</Card>}
        </div>
      </div>
    </DashboardShell>
  )
}

export default PrincipalApprovalPage
