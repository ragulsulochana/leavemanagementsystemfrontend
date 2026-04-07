import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import DashboardShell from '../../components/layout/DashboardShell'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveLeave, fetchLeaves, rejectLeave } from '../../redux/slices/leaveSlice'
import { getApiErrorMessage } from '../../services/api'
import { userService, UserDetail } from '../../services/userService'

export const PrincipalDashboard = () => {
  const dispatch = useAppDispatch()
  const { items: leaves, loading, error, success } = useAppSelector((state) => state.leave)
  const [toast, setToast] = useState('')
  const [hod, setHod] = useState({ name: '', email: '', password: '', department: '' })
  const [hods, setHods] = useState<UserDetail[]>([])
  const [hodListError, setHodListError] = useState('')

  useEffect(() => {
    dispatch(fetchLeaves())
    userService
      .getHods()
      .then(setHods)
      .catch((requestError) => setHodListError(getApiErrorMessage(requestError)))
  }, [dispatch])

  const finalList = leaves.filter((item) => item.status === 'hodApproved')
  const stats = useMemo(() => ({
    final: finalList.length,
    total: leaves.length,
    approved: leaves.filter((item) => item.status === 'approved').length,
    rejected: leaves.filter((item) => item.status === 'rejected').length,
  }), [finalList.length, leaves])

  const handleAddHod = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const newHod = await userService.createUser({ ...hod, role: 'hod' })
      setToast(`${newHod.name} assigned as HOD.`)
      setHods((current) => [newHod, ...current])
      setHod({ name: '', email: '', password: '', department: '' })
      window.setTimeout(() => setToast(''), 3000)
    } catch (requestError) {
      setToast(getApiErrorMessage(requestError))
      window.setTimeout(() => setToast(''), 3000)
    }
  }

  return (
    <DashboardShell title="Principal dashboard" subtitle="Executive control panel for final leave decisions and HOD management.">
      <div className="space-y-6">
        {toast && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-700 shadow-md">{toast}</div>}
        {(success || error) && <div className={`rounded-2xl border p-4 text-sm font-semibold shadow-md ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}

        <Card className="border-0 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Control panel</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black text-slate-950 md:text-5xl">Final decisions, simplified.</h1>
              <p className="mt-4 max-w-2xl text-slate-500">Review only HOD-approved requests and make the final call without analytics clutter.</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-5xl font-black">{stats.final}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Awaiting final decision</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Final Queue', stats.final, 'HOD approved'],
            ['All Requests', stats.total, 'Visible to principal'],
            ['Approved', stats.approved, 'Closed positive'],
            ['Rejected', stats.rejected, 'Closed declined'],
          ].map(([label, value, helper]) => (
            <Card key={label} className="p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">{label}</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{helper}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Final Approval List</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Decision cards</h2>
              </div>
              {loading && <span className="text-sm font-semibold text-slate-500">Loading final approvals...</span>}
            </div>

            <div className="grid gap-4">
              {finalList.map((leave) => (
                <div key={leave.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-slate-950">{leave.studentName}</h3>
                        <Badge tone="warning">{leave.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-500">{leave.department} | {leave.fromDate} to {leave.toDate}</p>
                      <p className="mt-3 text-sm text-slate-700">{leave.reason}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em]">
                        {['Student', 'Staff', 'HOD', 'Principal'].map((step) => (
                          <span key={step} className={`rounded-full px-3 py-2 ${step === 'Principal' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{step}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button type="button" onClick={() => dispatch(approveLeave(leave.id))} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-700">Approve</button>
                      <button type="button" onClick={() => dispatch(rejectLeave(leave.id))} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-red-700">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
              {finalList.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No HOD-approved requests are waiting for final approval.</p>}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Manage HOD</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Assign department</h2>
            <form onSubmit={handleAddHod} className="mt-6 space-y-4">
              <Input label="HOD name" value={hod.name} onChange={(event) => setHod({ ...hod, name: event.target.value })} required />
              <Input label="HOD email" type="email" value={hod.email} onChange={(event) => setHod({ ...hod, email: event.target.value })} required />
              <Input label="Password" type="password" value={hod.password} onChange={(event) => setHod({ ...hod, password: event.target.value })} required minLength={8} />
              <Input label="Department" value={hod.department} onChange={(event) => setHod({ ...hod, department: event.target.value })} required />
              <Button type="submit" className="w-full">Add HOD</Button>
            </form>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">Executive note</p>
              <p className="mt-2 text-sm text-slate-500">This panel stays intentionally simple: final decisions on the left, management setup on the right.</p>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">HOD details</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Department leadership</h2>
            </div>
            <Badge tone="neutral">{hods.length} HODs</Badge>
          </div>
          {hodListError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{hodListError}</div>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hods.map((hodUser) => (
              <div key={hodUser.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black text-slate-950">{hodUser.name}</p>
                <p className="mt-1 text-sm text-slate-500">{hodUser.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="neutral">{hodUser.role}</Badge>
                  <Badge tone="warning">{hodUser.department ?? 'General'}</Badge>
                </div>
              </div>
            ))}
            {hods.length === 0 && !hodListError && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">No HOD details found.</p>}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}

export default PrincipalDashboard
