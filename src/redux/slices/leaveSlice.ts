import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiErrorMessage } from '../../services/api'
import { leaveService } from '../../services/leaveService'
import type { RootState } from '../store'
import type { Role } from './authSlice'

export type LeaveStatus = 'approved' | 'pending' | 'staffApproved' | 'hodApproved' | 'rejected'

export type LeaveRequest = {
  id: string
  studentName: string
  department: string
  leaveType: string
  fromDate: string
  toDate: string
  reason: string
  proof?: string
  status: LeaveStatus
  submittedAt: string
  approverStage: 'Student' | 'Staff' | 'HOD' | 'Principal'
}

export type ApplyLeavePayload = {
  department: string
  leaveType: string
  fromDate: string
  toDate: string
  reason: string
  proof?: string
}

type LeaveState = {
  items: LeaveRequest[]
  loading: boolean
  success: string | null
  error: string | null
}

const initialState: LeaveState = {
  items: [],
  loading: false,
  success: null,
  error: null,
}

const getRole = (state: RootState): Role => state.auth.user?.role ?? 'student'

export const fetchLeaves = createAsyncThunk('leave/fetchLeaves', async (_, { getState, rejectWithValue }) => {
  try {
    return await leaveService.getLeaves(getRole(getState() as RootState))
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const applyLeave = createAsyncThunk('leave/applyLeave', async (payload: ApplyLeavePayload, { rejectWithValue }) => {
  try {
    return await leaveService.applyLeave(payload)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const approveLeave = createAsyncThunk('leave/approveLeave', async (id: string, { getState, rejectWithValue }) => {
  try {
    return await leaveService.approveLeave(id, getRole(getState() as RootState))
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const rejectLeave = createAsyncThunk('leave/rejectLeave', async (id: string, { rejectWithValue }) => {
  try {
    return await leaveService.rejectLeave(id)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

const upsertLeave = (items: LeaveRequest[], leave: LeaveRequest) => {
  const existingIndex = items.findIndex((item) => item.id === leave.id)
  if (existingIndex === -1) return [leave, ...items]

  return items.map((item) => (item.id === leave.id ? leave : item))
}

const removeFromQueue = (items: LeaveRequest[], leave: LeaveRequest) =>
  items.filter((item) => item.id !== leave.id)

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaveFeedback(state) {
      state.error = null
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to fetch leaves.'
      })
      .addCase(applyLeave.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false
        state.items = upsertLeave(state.items, action.payload)
        state.success = 'Leave request submitted successfully.'
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to submit leave.'
      })
      .addCase(approveLeave.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false
        state.items = removeFromQueue(state.items, action.payload)
        state.success = 'Leave request approved.'
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to approve leave.'
      })
      .addCase(rejectLeave.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.loading = false
        state.items = removeFromQueue(state.items, action.payload)
        state.success = 'Leave request rejected.'
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Unable to reject leave.'
      })
  },
})

export const { clearLeaveFeedback } = leaveSlice.actions
export default leaveSlice.reducer
