import { FormEvent, useEffect, useMemo, useState } from 'react'
import { RequestsTable } from '../../components/dashboard/RequestsTable'
import DashboardShell from '../../components/layout/DashboardShell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveLeave, fetchLeaves, LeaveStatus, rejectLeave } from '../../redux/slices/leaveSlice'
import { getApiErrorMessage } from '../../services/api'
import { userService, UserDetail } from '../../services/userService'

const staffTabs: LeaveStatus[] = ['pending', 'approved', 'rejected']

export const StaffDashboard = () => {
  const dispatch = useAppDispatch()
  const { items: leaves, loading, error, success } = useAppSelector((state) => state.leave)
  const [filter, setFilter] = useState<LeaveStatus>('pending')
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' })
  const [studentFeedback, setStudentFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [students, setStudents] = useState<UserDetail[]>([])
  const [studentsError, setStudentsError] = useState('')

  useEffect(() => {
    dispatch(fetchLeaves())
    userService
      .getStudents()
      .then(setStudents)
      .catch((requestError) => setStudentsError(getApiErrorMessage(requestError)))
  }, [dispatch])

  const stats = useMemo(() => ({
    pending: leaves.filter((item) => item.status === 'pending').length,
    approved: leaves.filter((item) => item.status === 'approved').length,
    rejected: leaves.filter((item) => item.status === 'rejected').length,
  }), [leaves])

  const filtered = leaves.filter((item) => item.status === filter)

  const handleAddStudent = async (event: FormEvent) => {
    event.preventDefault()
    setStudentFeedback(null)

    try {
      const student = await userService.createUser({ ...studentForm, role: 'student' })
      setStudentFeedback({ type: 'success', message: `${student.name} added as a student.` })
      setStudentForm({ name: '', email: '', password: '' })
      setStudents((current) => [student, ...current])
    } catch (requestError) {
      setStudentFeedback({ type: 'error', message: getApiErrorMessage(requestError) })
    }
  }

  return (
    <DashboardShell title="Staff dashboard" subtitle="Fast request handling for staff approvals.">
      <div className="space-y-6">
        {(success || error) && <div className={`rounded-2xl border p-4 text-sm font-semibold shadow-md ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card className="border-0 bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-300">Action queue</p>
                <h1 className="mt-3 text-4xl font-black">Approve what is waiting.</h1>
                <p className="mt-3 max-w-xl text-slate-300">This view is intentionally table-heavy so staff can scan requests, compare dates, and act quickly.</p>
              </div>
              <div className="rounded-3xl bg-amber-300 p-6 text-center text-slate-950">
                <p className="text-5xl font-black">{stats.pending}</p>
                <p className="mt-1 text-sm font-black uppercase tracking-[0.2em]">Pending</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-bold text-amber-700">Pending</p>
              <p className="mt-2 text-3xl font-black text-amber-900">{stats.pending}</p>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-bold text-emerald-700">Approved</p>
              <p className="mt-2 text-3xl font-black text-emerald-900">{stats.approved}</p>
            </Card>
            <Card className="border-red-200 bg-red-50 p-5">
              <p className="text-sm font-bold text-red-700">Rejected</p>
              <p className="mt-2 text-3xl font-black text-red-900">{stats.rejected}</p>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Student management</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Add Student</h2>
            <p className="mt-1 text-sm text-slate-500">Create a student account for leave application access.</p>
          </div>
          {studentFeedback && (
            <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${studentFeedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {studentFeedback.message}
            </div>
          )}
          <form onSubmit={handleAddStudent} className="grid gap-4 md:grid-cols-4">
            <Input label="Student name" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} required />
            <Input label="Student email" type="email" value={studentForm.email} onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })} required />
            <Input label="Password" type="password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} required minLength={8} />
            <div className="flex items-end">
              <Button type="submit" className="w-full">Add Student</Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Student details</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Students under review</h2>
            </div>
            <Badge tone="neutral">{students.length} students</Badge>
          </div>
          {studentsError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{studentsError}</div>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => (
              <div key={student.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black text-slate-950">{student.name}</p>
                <p className="mt-1 text-sm text-slate-500">{student.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="neutral">{student.role}</Badge>
                  <Badge tone="warning">{student.department ?? 'General'}</Badge>
                </div>
              </div>
            ))}
            {students.length === 0 && !studentsError && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">No student details found.</p>}
          </div>
        </Card>

        <Card className="p-6 shadow-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Requests Table</h2>
              <p className="mt-1 text-sm text-slate-500">Primary workspace for review, approval, and rejection.</p>
            </div>
            <div className="flex rounded-2xl bg-slate-100 p-1">
              {staffTabs.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-xl px-4 py-2 text-sm font-black capitalize transition ${filter === status ? 'bg-white text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge tone="warning">Pending first</Badge>
            <Badge tone="neutral">{filtered.length} visible</Badge>
            {loading && <span className="text-sm font-semibold text-slate-500">Loading requests...</span>}
          </div>

          <RequestsTable requests={filtered} onApprove={(id) => dispatch(approveLeave(id))} onReject={(id) => dispatch(rejectLeave(id))} />
        </Card>
      </div>
    </DashboardShell>
  )
}

export default StaffDashboard
