import { NavLink } from 'react-router-dom'
import type { Role } from '../../redux/slices/authSlice'

type SidebarProps = {
  role: Role
}

const menuByRole: Record<Role, Array<{ label: string; path: string }>> = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Apply Leave', path: '/student/apply' },
    { label: 'My Leaves', path: '/student/leaves' },
    { label: 'Requests', path: '/student/leaves' },
    { label: 'Profile', path: '/student/profile' },
  ],
  staff: [
    { label: 'Dashboard', path: '/staff/dashboard' },
    { label: 'Apply Leave', path: '/staff/dashboard' },
    { label: 'My Leaves', path: '/staff/dashboard' },
    { label: 'Requests', path: '/staff/requests' },
    { label: 'Profile', path: '/staff/profile' },
  ],
  hod: [
    { label: 'Dashboard', path: '/hod/dashboard' },
    { label: 'Apply Leave', path: '/hod/dashboard' },
    { label: 'My Leaves', path: '/hod/dashboard' },
    { label: 'Requests', path: '/hod/dashboard' },
    { label: 'Profile', path: '/hod/profile' },
  ],
  principal: [
    { label: 'Dashboard', path: '/principal/dashboard' },
    { label: 'Apply Leave', path: '/principal/dashboard' },
    { label: 'My Leaves', path: '/principal/dashboard' },
    { label: 'Requests', path: '/principal/requests' },
    { label: 'Profile', path: '/principal/profile' },
  ],
}

export const Sidebar = ({ role }: SidebarProps) => {
  const menu = menuByRole[role]

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-white/95 px-6 py-7 shadow-xl shadow-slate-200/60 backdrop-blur lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-black text-white shadow-lg">
          L
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">LeaveMS</p>
          <h1 className="text-2xl font-black text-slate-950">LeaveMS</h1>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={`${item.label}-${item.path}`}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700 ${
                isActive ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-600'
              }`
            }
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold">{item.label.slice(0, 2)}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-5">
        <p className="font-bold text-slate-900">Signed in as</p>
        <p className="mt-2 text-sm capitalize text-slate-500">{role} workspace</p>
      </div>
    </aside>
  )
}
