import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api, { getApiErrorMessage } from '../../services/api'

export type Role = 'student' | 'staff' | 'hod' | 'principal'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  department?: string
}

type AuthResponse = {
  token: string
  user: User
}

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const savedUser = localStorage.getItem('leave_ms_user')
const savedToken = localStorage.getItem('leave_ms_token')

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  },
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { name: string; email: string; password: string; role: Role }, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  },
)

const saveSession = ({ token, user }: AuthResponse) => {
  localStorage.setItem('leave_ms_token', token)
  localStorage.setItem('leave_ms_user', JSON.stringify(user))
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('leave_ms_token')
      localStorage.removeItem('leave_ms_user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        saveSession(action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to login right now.'
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        saveSession(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to create account right now.'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
