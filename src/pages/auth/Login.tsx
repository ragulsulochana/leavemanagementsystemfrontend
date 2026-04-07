import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { loginUser, Role } from '../../redux/slices/authSlice'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AuthShell } from './AuthShell'

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'student' as Role })

  useEffect(() => {
    if (user) navigate(`/${user.role}/dashboard`)
  }, [navigate, user])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await dispatch(loginUser({ email: form.email, password: form.password }))
  }

  return (
    <AuthShell title="Login" subtitle="Enter the control room" variant="login">
      <div className="mb-6 rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm font-black text-blue-200">Role-based redirect is automatic</p>
        <p className="mt-2 text-sm text-slate-300">Use your account email and password. LeaveMS sends you to the correct dashboard after login.</p>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {(['student', 'staff', 'hod', 'principal'] as Role[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setForm({ ...form, role })}
            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${form.role === role ? 'border-blue-400 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            <span className="text-sm font-black capitalize">{role}</span>
            <span className="mt-1 block text-xs">{role === 'student' ? 'Personal leave tracker' : role === 'staff' ? 'Approval action queue' : role === 'hod' ? 'Analytics workspace' : 'Final decision panel'}</span>
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" icon="@" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="block text-sm font-medium text-slate-600">
          Password
          <div className="relative mt-2">
            <input
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-3 pr-16 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary-500">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <Button type="submit" size="lg" className="w-full rounded-full py-4" disabled={loading}>{loading ? 'Signing in...' : 'Unlock dashboard'}</Button>
      </form>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
        <Link to="/forgot-password" className="font-semibold text-slate-500 hover:text-primary-500">Forgot password?</Link>
        <Link to="/signup" className="font-bold text-primary-500 hover:text-primary-600">Create account</Link>
      </div>
    </AuthShell>
  )
}

export default Login
