import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // backend
  withCredentials: true, // 🔥 REQUIRED for cookies
})

// 🔁 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'SESSION_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh')
        return api(originalRequest) // retry original request
      } catch {
        // hard logout
        window.location.href = '/signin'
      }
    }

    return Promise.reject(error)
  }
)

export default api
