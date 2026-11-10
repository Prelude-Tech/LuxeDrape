import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Request interceptor — cookies are sent automatically with withCredentials
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor — on 401, clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/auth/login')
      const isOnLoginPage = window.location.pathname.startsWith('/admin/login')
      if (!isAuthCheck && !isOnLoginPage) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
