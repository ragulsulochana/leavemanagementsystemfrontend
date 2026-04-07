import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://import.meta.env.VITE_API_URL/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leave_ms_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('leave_ms_token')
      localStorage.removeItem('leave_ms_user')

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    const validationErrors = data?.errors

    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors
        .map((item) => item?.msg)
        .filter(Boolean)
        .join(', ')
    }

    return data?.message ?? error.message ?? 'Something went wrong'
  }

  return 'Something went wrong'
}

export default api
