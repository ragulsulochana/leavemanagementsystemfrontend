import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="max-w-lg p-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-500">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">The route you opened does not exist in LeaveMS.</p>
        <Link to="/login" className="mt-6 inline-block"><Button>Back to login</Button></Link>
      </Card>
    </div>
  )
}

export default NotFound
