import { FormEvent, useEffect, useMemo, useState } from 'react'
import { BarChart } from '../../components/charts/BarChart'
import { DonutChart } from '../../components/charts/DonutChart'
import { LineChart } from '../../components/charts/LineChart'
import { RequestsTable } from '../../components/dashboard/RequestsTable'
import DashboardShell from '../../components/layout/DashboardShell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveLeave, fetchLeaves, rejectLeave } from '../../redux/slices/leaveSlice'
import { getApiErrorMessage } from '../../services/api'
import { userService, UserDetail } from '../../services/userService'

export const HODDashboard = () => {
  const dispatch = useAppDispatch()
  const { items: leaves, loading, error, success } = useAppSelector((state) => state.leave)
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '' })
  const [staffFeedback, setStaffFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [staffMembers, setStaffMembers] = useState<UserDetail[]>([])
  const [staffListError, setStaffListError] = useState('')

  useEffect(() => {
    dispatch(fetchLeaves())
    userService
      .getStaff()
      .then(setStaffMembers)
      .catch((requestError) => setStaffListError(getApiErrorMessage(requestError)))
  }, [dispatch])

  const staffApproved = leaves.filter((item) => item.status === 'staffApproved')
  const approved = leaves.filter((item) => item.status === 'approved')
  const rejected = leaves.filter((item) => item.status === 'rejected')

  const departmentData = useMemo(() => {
    const totals = leaves.reduce<Record<string, number>>((acc, item) => {
      acc[item.department] = (acc[item.department] ?? 0) + 1
      return acc
    }, {})
    return Object.entries(totals).map(([name, value]) => ({ name, value }))
  }, [leaves])

  const trendData = useMemo(() => {
    const totals = leaves.reduce<Record<string, number>>((acc, item) => {
      const key = item.submittedAt || item.fromDate || 'Unknown'
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
    const entries = Object.entries(totals).slice(0, 6)
    return entries.length ? entries.map(([name, value]) => ({ name, value })) : [{ name: 'No data', value: 0 }]
  }, [leaves])

  const handleAddStaff = async (event: FormEvent) => {
    event.preventDefault()
    setStaffFeedback(null)

    try {
      const staff = await userService.createUser({ ...staffForm, role: 'staff' })
      setStaffFeedback({ type: 'success', message: `${staff.name} added as staff.` })
      setStaffForm({ name: '', email: '', password: '' })
      setStaffMembers((current) => [staff, ...current])
    } catch (requestError) {
      setStaffFeedback({ type: 'error', message: getApiErrorMessage(requestError) })
    }
  }

  return (
    <DashboardShell title="HOD dashboard" subtitle="Analytics-first view for department-level leave planning.">
      <div className="space-y-6">
        {(success || error) && <div className={`rounded-2xl border p-4 text-sm font-semibold shadow-md ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}

        <div className="grid gap-6 xl:grid-cols-[1fr_0.45fr]">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 text-white shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">Analytics view</p>
            <h1 className="mt-4 text-4xl font-black md:text-5xl">Department leave intelligence.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Use charts first, then drill into staff-approved requests that need HOD action.</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Quick Actions</p>
            <div className="mt-5 space-y-3">
              <Button className="w-full" onClick={() => dispatch(fetchLeaves())} disabled={loading}>Refresh analytics</Button>
              <Button className="w-full" variant="secondary">Export report</Button>
              <Button className="w-full" variant="ghost">View policy notes</Button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Staff management</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Add Staff</h2>
            <p className="mt-1 text-sm text-slate-500">Create a staff approver account for the first approval level.</p>
          </div>
          {staffFeedback && (
            <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${staffFeedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {staffFeedback.message}
            </div>
          )}
          <form onSubmit={handleAddStaff} className="grid gap-4 md:grid-cols-4">
            <Input label="Staff name" value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })} required />
            <Input label="Staff email" type="email" value={staffForm.email} onChange={(event) => setStaffForm({ ...staffForm, email: event.target.value })} required />
            <Input label="Password" type="password" value={staffForm.password} onChange={(event) => setStaffForm({ ...staffForm, password: event.target.value })} required minLength={8} />
            <div className="flex items-end">
              <Button type="submit" className="w-full">Add Staff</Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Staff details</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Staff approval team</h2>
            </div>
            <Badge tone="neutral">{staffMembers.length} staff</Badge>
          </div>
          {staffListError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{staffListError}</div>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black text-slate-950">{staff.name}</p>
                <p className="mt-1 text-sm text-slate-500">{staff.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="neutral">{staff.role}</Badge>
                  <Badge tone="warning">{staff.department ?? 'General'}</Badge>
                </div>
              </div>
            ))}
            {staffMembers.length === 0 && !staffListError && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">No staff details found.</p>}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Total', leaves.length, 'All department requests'],
            ['For HOD', staffApproved.length, 'Staff-approved queue'],
            ['Approved', approved.length, 'Final approvals'],
            ['Rejected', rejected.length, 'Declined requests'],
          ].map(([label, value, helper]) => (
            <Card key={label} className="p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">{label}</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{helper}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Status distribution</h2>
              <Badge tone="neutral">Live</Badge>
            </div>
            <DonutChart data={[
              { name: 'Approved', value: approved.length, color: '#22C55E' },
              { name: 'Staff approved', value: staffApproved.length, color: '#F59E0B' },
              { name: 'Rejected', value: rejected.length, color: '#EF4444' },
            ]} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-slate-950">Department leaves</h2>
            <BarChart data={departmentData.length ? departmentData : [{ name: 'No data', value: 0 }]} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-slate-950">Trends</h2>
            <LineChart data={trendData} />
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Secondary review</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Staff-approved requests</h2>
            </div>
            {loading && <span className="text-sm font-semibold text-slate-500">Loading staff-approved requests...</span>}
          </div>
          <RequestsTable requests={leaves} onApprove={(id) => dispatch(approveLeave(id))} onReject={(id) => dispatch(rejectLeave(id))} />
        </Card>
      </div>
    </DashboardShell>
  )
}

export default HODDashboard
