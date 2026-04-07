import type { LeaveRequest } from '../../redux/slices/leaveSlice'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

export const LeaveCard = ({ leave }: { leave: LeaveRequest }) => {
  return (
    <Card className="p-5 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-950">{leave.leaveType} leave</p>
          <p className="mt-1 text-sm text-slate-500">{leave.fromDate} to {leave.toDate}</p>
        </div>
        <Badge tone={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}>{leave.status}</Badge>
      </div>
      <p className="mt-4 text-sm text-slate-600">{leave.reason}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{leave.approverStage} review</p>
    </Card>
  )
}
