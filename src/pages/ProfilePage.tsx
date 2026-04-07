import DashboardShell from '../components/layout/DashboardShell'
import { Card } from '../components/ui/Card'
import { useAppSelector } from '../hooks'

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <DashboardShell title="Profile" subtitle="Basic account details for the signed-in role.">
      <Card className="max-w-2xl p-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Account</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{user?.name}</h1>
        <p className="mt-2 text-slate-500">{user?.email}</p>
        <p className="mt-6 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-black capitalize text-blue-700">{user?.role}</p>
      </Card>
    </DashboardShell>
  )
}

export default ProfilePage
