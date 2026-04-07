import { FormEvent, useEffect, useState } from 'react'
import DashboardShell from '../../components/layout/DashboardShell'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { applyLeave, clearLeaveFeedback } from '../../redux/slices/leaveSlice'

export const ApplyLeavePage = () => {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector((state) => state.leave)
  const [form, setForm] = useState({ leaveType: 'Casual', fromDate: '', toDate: '', reason: '', department: 'Computer Science' })

  useEffect(() => {
    return () => {
      dispatch(clearLeaveFeedback())
    }
  }, [dispatch])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await dispatch(applyLeave(form))
    if (applyLeave.fulfilled.match(result)) {
      setForm({ leaveType: 'Casual', fromDate: '', toDate: '', reason: '', department: 'Computer Science' })
    }
  }

  return (
    <DashboardShell title="Apply leave" subtitle="Submit a new request into the Student to Staff to HOD to Principal workflow.">
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border-0 bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-100">Student action</p>
          <h1 className="mt-4 text-4xl font-black">Request time away with context.</h1>
          <p className="mt-4 text-blue-50">Keep the reason clear and choose dates carefully. The request is sent to staff first.</p>
        </Card>
        <Card className="p-6">
          {(success || error) && <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error ?? success}</div>}
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
              <Input label="Reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit leave request'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}

export default ApplyLeavePage
