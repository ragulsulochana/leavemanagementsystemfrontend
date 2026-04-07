import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-500">Reset</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Forgot password?</h1>
        <p className="mt-3 text-sm text-slate-500">Enter your email and we will send reset instructions.</p>
        <form className="mt-6 space-y-5">
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Button type="submit" className="w-full" size="lg">Send reset link</Button>
        </form>
        <Link to="/login" className="mt-6 inline-block text-sm font-bold text-primary-500">Back to login</Link>
      </Card>
    </div>
  )
}

export default ForgotPassword
