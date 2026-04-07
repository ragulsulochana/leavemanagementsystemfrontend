import type { LeaveRequest, LeaveStatus } from '../../redux/slices/leaveSlice'
import { Badge } from '../ui/Badge'

type RequestsTableProps = {
  requests: LeaveRequest[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

const toneFor = (status: LeaveStatus) => (status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning')

export const RequestsTable = ({ requests, onApprove, onReject }: RequestsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-slate-50">
          <tr>
            {['Applicant', 'Department', 'Period', 'Reason', 'Status', 'Actions'].map((head) => (
              <th key={head} className="px-4 py-4 text-left font-black text-slate-600">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {requests.map((request) => (
            <tr key={request.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-4 font-bold text-slate-900">{request.studentName}</td>
              <td className="px-4 py-4 text-slate-600">{request.department}</td>
              <td className="px-4 py-4 text-slate-600">{request.fromDate} to {request.toDate}</td>
              <td className="max-w-xs px-4 py-4 text-slate-600">{request.reason}</td>
              <td className="px-4 py-4"><Badge tone={toneFor(request.status)}>{request.status}</Badge></td>
              <td className="space-x-2 px-4 py-4">
                <button
                  type="button"
                  disabled={request.status === 'approved' || request.status === 'rejected'}
                  onClick={() => onApprove?.(request.id)}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={request.status === 'approved' || request.status === 'rejected'}
                  onClick={() => onReject?.(request.id)}
                  className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-slate-500">No leave requests found for this view.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
