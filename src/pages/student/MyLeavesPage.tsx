import { useEffect } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import DashboardShell from '../../components/layout/DashboardShell'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchLeaves } from '../../redux/slices/leaveSlice'

const statusTone = (status: string) => (status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning')

export const MyLeavesPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((state) => state.leave)

  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  return (
    <DashboardShell title="My leaves" subtitle="Card-based history of your own leave requests.">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm font-semibold text-slate-500">Loading leaves...</p>}
        {items.map((leave) => (
          <Card key={leave.id} className="p-6 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black text-slate-950">{leave.leaveType}</p>
                <p className="mt-1 text-sm text-slate-500">{leave.fromDate} to {leave.toDate}</p>
              </div>
              <Badge tone={statusTone(leave.status)}>{leave.status}</Badge>
            </div>
            <p className="mt-5 text-sm text-slate-600">{leave.reason}</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">{leave.approverStage} stage</p>
          </Card>
        ))}
        {items.length === 0 && !loading && <Card className="p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">No leave requests yet.</Card>}
      </div>
    </DashboardShell>
  )
}

export default MyLeavesPage
