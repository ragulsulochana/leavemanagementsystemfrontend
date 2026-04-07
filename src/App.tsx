import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from './hooks'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import StudentDashboard from './pages/student/StudentDashboard'
import ApplyLeavePage from './pages/student/ApplyLeavePage'
import MyLeavesPage from './pages/student/MyLeavesPage'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffRequestsPage from './pages/staff/StaffRequestsPage'
import HODDashboard from './pages/hod/HODDashboard'
import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import PrincipalApprovalPage from './pages/principal/PrincipalApprovalPage'
import NotFound from './pages/NotFound'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user && token ? `/${user.role}/dashboard` : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/apply" element={<ProtectedRoute allowedRoles={['student']}><ApplyLeavePage /></ProtectedRoute>} />
      <Route path="/student/leaves" element={<ProtectedRoute allowedRoles={['student']}><MyLeavesPage /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
      <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/requests" element={<ProtectedRoute allowedRoles={['staff']}><StaffRequestsPage /></ProtectedRoute>} />
      <Route path="/staff/profile" element={<ProtectedRoute allowedRoles={['staff']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />
      <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
      <Route path="/hod/profile" element={<ProtectedRoute allowedRoles={['hod']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/principal" element={<Navigate to="/principal/dashboard" replace />} />
      <Route path="/principal/dashboard" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
      <Route path="/principal/requests" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalApprovalPage /></ProtectedRoute>} />
      <Route path="/principal/profile" element={<ProtectedRoute allowedRoles={['principal']}><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
