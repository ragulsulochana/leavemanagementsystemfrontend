import api from './api'
import type { Role, User } from '../redux/slices/authSlice'

type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: Role
  department?: string
}

type CreateUserResponse = {
  user: User
}

export type UserDetail = User & {
  createdAt?: string
}

export const userService = {
  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<CreateUserResponse>('/auth/register', payload)
    return response.data.user
  },

  async getStudents(): Promise<UserDetail[]> {
    const response = await api.get<UserDetail[]>('/users/students')
    return response.data
  },

  async getStaff(): Promise<UserDetail[]> {
    const response = await api.get<UserDetail[]>('/users/staff')
    return response.data
  },

  async getHods(): Promise<UserDetail[]> {
    const response = await api.get<UserDetail[]>('/users/hods')
    return response.data
  },
}
