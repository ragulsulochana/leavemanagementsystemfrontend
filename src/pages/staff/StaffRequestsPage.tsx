import { useEffect, useMemo, useState } from 'react'
import { RequestsTable } from '../../components/dashboard/RequestsTable'
import DashboardShell from '../../components/layout/DashboardShell'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveLeave, fetchLeaves, LeaveStatus, rejectLeave } from '../../redux/slices/leaveSlice'

const tabs: LeaveStatus[] = ['pending', 'approved', 'rejected']

export const StaffRequestsPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error, success } = useAppSelector((state) => state.leave)
  const [filter, setFilter] = useState<LeaveStatus>('pending')

  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  const filtered = useMemo(() => items.filter((item) => item.status === filter), [filter, items])

  return (
    <DashboardShell title="Staff requests" subtitle="A focused table workspace for approving or rejecting student requests.">
      <Card className="p-6 shadow-xl">
        {(success || error) && <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950">Requests Table</h1>
            <p className="mt-2 text-sm text-slate-500">Staff approval queue with fast actions.</p>
          </div>
          <div className="flex rounded-2xl bg-slate-100 p-1">
            {tabs.map((status) => (
              <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-xl px-4 py-2 text-sm font-black capitalize ${filter === status ? 'bg-white text-slate-950 shadow-md' : 'text-slate-500'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 flex gap-3">
          <Badge tone="warning">{filtered.length} {filter}</Badge>
          {loading && <span className="text-sm font-semibold text-slate-500">Loading...</span>}
        </div>
        <RequestsTable requests={filtered} onApprove={(id) => dispatch(approveLeave(id))} onReject={(id) => dispatch(rejectLeave(id))} />
      </Card>
    </DashboardShell>
  )
}

export default StaffRequestsPage
