import api from './api'
import type { Role } from '../redux/slices/authSlice'
import type { ApplyLeavePayload, LeaveRequest } from '../redux/slices/leaveSlice'

type BackendStudent = {
  _id?: string
  id?: string
  name?: string
  email?: string
}

type BackendLeave = {
  _id?: string
  id?: string
  studentId?: BackendStudent
  department?: string
  leaveType?: string
  fromDate: string
  toDate: string
  reason: string
  proof?: string
  status: LeaveRequest['status']
  createdAt?: string
  updatedAt?: string
}

const toDateString = (value?: string) => (value ? value.slice(0, 10) : '')

export const normalizeLeave = (leave: BackendLeave): LeaveRequest => {
  const student = typeof leave.studentId === 'object' ? leave.studentId : undefined
  const status = leave.status

  return {
    id: leave._id ?? leave.id ?? '',
    studentName: student?.name ?? 'Student',
    department: leave.department ?? 'General',
    leaveType: leave.leaveType ?? 'Casual',
    fromDate: toDateString(leave.fromDate),
    toDate: toDateString(leave.toDate),
    reason: leave.reason,
    proof: leave.proof,
    status,
    submittedAt: toDateString(leave.createdAt),
    approverStage:
      status === 'pending'
        ? 'Staff'
        : status === 'staffApproved'
          ? 'HOD'
          : status === 'hodApproved'
            ? 'Principal'
            : 'Principal',
  }
}

const normalizeLeaves = (leaves: BackendLeave[]) => leaves.map(normalizeLeave)

export const leaveService = {
  async getLeaves(role: Role): Promise<LeaveRequest[]> {
    const endpointByRole: Record<Role, string> = {
      student: '/leaves/my',
      staff: '/leaves/pending',
      hod: '/leaves/staff-approved',
      principal: '/leaves/hod-approved',
    }

    const response = await api.get<BackendLeave[]>(endpointByRole[role])
    return normalizeLeaves(response.data)
  },

  async applyLeave(payload: ApplyLeavePayload): Promise<LeaveRequest> {
    const response = await api.post<BackendLeave>('/leaves/apply', payload)
    return normalizeLeave(response.data)
  },

  async approveLeave(id: string, role: Role): Promise<LeaveRequest> {
    const endpointByRole: Partial<Record<Role, string>> = {
      staff: `/leaves/${id}/staff-approve`,
      hod: `/leaves/${id}/hod-approve`,
      principal: `/leaves/${id}/final-approve`,
    }
    const endpoint = endpointByRole[role]

    if (!endpoint) {
      throw new Error('This role cannot approve leave requests')
    }

    const response = await api.put<BackendLeave>(endpoint)
    return normalizeLeave(response.data)
  },

  async rejectLeave(id: string): Promise<LeaveRequest> {
    const response = await api.put<BackendLeave>(`/leaves/${id}/reject`)
    return normalizeLeave(response.data)
  },
}
