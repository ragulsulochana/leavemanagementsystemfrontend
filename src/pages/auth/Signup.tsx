import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { Role, registerUser } from '../../redux/slices/authSlice'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AuthShell } from './AuthShell'

export const Signup = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as Role })

  useEffect(() => {
    if (user) navigate(`/${user.role}/dashboard`)
  }, [navigate, user])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await dispatch(registerUser(form))
  }

  return (
    <AuthShell title="Signup" subtitle="Build your role profile" variant="signup">
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {(['student', 'staff', 'hod', 'principal'] as Role[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setForm({ ...form, role })}
            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${form.role === role ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            <span className="text-sm font-black capitalize">{role}</span>
            <span className="mt-1 block text-xs">{role === 'student' ? 'Apply and track leaves' : role === 'staff' ? 'Review pending requests' : role === 'hod' ? 'Analyze department flow' : 'Finalize approvals'}</span>
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <p className="-mt-3 text-xs font-semibold text-slate-500">Password must be at least 8 characters.</p>
        <label className="block text-sm font-medium text-slate-600">
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })} className="mt-2 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50">
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
          </select>
        </label>
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <Button type="submit" size="lg" className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 py-4 hover:from-emerald-600 hover:to-teal-600" disabled={loading}>{loading ? 'Creating...' : 'Create workspace access'}</Button>
      </form>
      <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-slate-600">Already registered? <Link to="/login" className="font-bold text-emerald-700">Login</Link></p>
    </AuthShell>
  )
}

export default Signup
