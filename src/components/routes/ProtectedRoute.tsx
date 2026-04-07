import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../../hooks'
import type { Role } from '../../redux/slices/authSlice'

type ProtectedRouteProps = {
  allowedRoles: Role[]
  children: ReactNode
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { token, user } = useAppSelector((state) => state.auth)
  const storedToken = localStorage.getItem('leave_ms_token')

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return children
}
