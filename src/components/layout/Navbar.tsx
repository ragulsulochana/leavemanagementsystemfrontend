import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { logout } from '../../redux/slices/authSlice'

export const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const initial = user?.name.charAt(0).toUpperCase() ?? 'U'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Welcome back</p>
          <h2 className="text-2xl font-black text-slate-950">{user?.name ?? 'Demo User'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" aria-label="Notifications">
            <span className="text-lg">!</span>
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{initial}</div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold capitalize text-slate-900">{user?.role ?? 'student'}</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
