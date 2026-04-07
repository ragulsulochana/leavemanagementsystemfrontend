import { FormEvent, useEffect, useMemo, useState } from 'react'
import DashboardShell from '../../components/layout/DashboardShell'
import { TimelineStepper } from '../../components/dashboard/TimelineStepper'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { applyLeave, clearLeaveFeedback, fetchLeaves } from '../../redux/slices/leaveSlice'

const statusTone = (status: string) => (status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning')

export const StudentDashboard = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error, success } = useAppSelector((state) => state.leave)
  const { user } = useAppSelector((state) => state.auth)
  const [showApply, setShowApply] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ leaveType: 'Casual', fromDate: '', toDate: '', reason: '', department: 'Computer Science' })

  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  useEffect(() => {
    if (!success && !error) return
    setToast(success ?? error ?? '')
    const timer = window.setTimeout(() => {
      setToast('')
      dispatch(clearLeaveFeedback())
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [dispatch, error, success])

  const stats = useMemo(() => ({
    total: items.length,
    approved: items.filter((item) => item.status === 'approved').length,
    pending: items.filter((item) => ['pending', 'staffApproved', 'hodApproved'].includes(item.status)).length,
    rejected: items.filter((item) => item.status === 'rejected').length,
  }), [items])

  const activeLeave = items[0]

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await dispatch(applyLeave(form))
    if (applyLeave.fulfilled.match(result)) {
      setForm({ leaveType: 'Casual', fromDate: '', toDate: '', reason: '', department: 'Computer Science' })
      setShowApply(false)
    }
  }

  return (
    <DashboardShell title="Student dashboard" subtitle="A personal leave tracker built around your requests and approval progress.">
      <div className="relative space-y-6 pb-24">
        {toast && <div className={`rounded-2xl border p-4 text-sm font-semibold shadow-md ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{toast}</div>}

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-8 text-white shadow-xl">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-100">Personal view</p>
            <h1 className="mt-4 text-4xl font-black md:text-5xl">Hi {user?.name ?? 'Student'}, here is your leave journey.</h1>
            <p className="mt-4 text-blue-50">Track each request from submission to final principal approval with a calm, visual workspace.</p>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Total Leaves', stats.total, 'bg-blue-50 text-blue-700'],
            ['Approved', stats.approved, 'bg-emerald-50 text-emerald-700'],
            ['Pending', stats.pending, 'bg-amber-50 text-amber-700'],
            ['Rejected', stats.rejected, 'bg-red-50 text-red-700'],
          ].map(([label, value, className]) => (
            <Card key={label} className="p-6">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className={`mt-4 inline-flex rounded-2xl px-4 py-2 text-3xl font-black ${className}`}>{value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-500">Leave Timeline</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{activeLeave ? activeLeave.leaveType : 'No active request'}</h2>
            <p className="mt-2 text-sm text-slate-500">{activeLeave ? `${activeLeave.fromDate} to ${activeLeave.toDate}` : 'Apply for leave to start the approval workflow.'}</p>
            <div className="mt-6">
              <TimelineStepper active={activeLeave?.approverStage ?? 'Student'} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">My Leaves List</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Recent requests</h2>
              </div>
              {loading && <span className="text-sm font-semibold text-slate-500">Loading...</span>}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((leave) => (
                <div key={leave.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-slate-950">{leave.fromDate} to {leave.toDate}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{leave.leaveType}</p>
                    </div>
                    <Badge tone={statusTone(leave.status)}>{leave.status}</Badge>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{leave.reason}</p>
                </div>
              ))}
              {items.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2">No leave requests yet. Use the floating button to apply.</p>}
            </div>
          </Card>
        </div>

        {showApply && (
          <Card className="fixed bottom-24 right-6 z-30 w-[calc(100vw-3rem)] max-w-xl p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Apply Leave</h2>
              <button type="button" onClick={() => setShowApply(false)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-600">
                Leave type
                <select value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })} className="mt-2 w-full rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50">
                  <option>Casual</option>
                  <option>Medical</option>
                  <option>Academic</option>
                </select>
              </label>
              <Input label="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required />
              <Input label="From date" type="date" value={form.fromDate} onChange={(event) => setForm({ ...form, fromDate: event.target.value })} required />
              <Input label="To date" type="date" value={form.toDate} onChange={(event) => setForm({ ...form, toDate: event.target.value })} required />
              <div className="md:col-span-2">
                <Input label="Reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Briefly describe your request" required />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Submitting...' : 'Submit request'}</Button>
              </div>
            </form>
          </Card>
        )}

        <button type="button" onClick={() => setShowApply(true)} className="fixed bottom-6 right-6 z-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
          Apply Leave
        </button>
      </div>
    </DashboardShell>
  )
}

export default StudentDashboard
