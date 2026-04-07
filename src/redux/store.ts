import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import leaveReducer from './slices/leaveSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
